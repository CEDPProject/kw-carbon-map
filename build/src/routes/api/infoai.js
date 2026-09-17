"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iaqVentConInfo = exports.infoaiRouter = void 0;
const express_1 = require("express");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const database_1 = require("../../../config/database");
const MemberDeviceControlManage_1 = require("../../entities/MemberDeviceControlManage");
const MemberDeviceManage_1 = require("../../entities/MemberDeviceManage");
const Device_1 = require("../../entities/Device");
const tsdbData_1 = require("../../services/tsdbData");
const baseUrl = "https://datacenter.kweather.co.kr/api/collection/v2/history";
const infoaiRouter = (0, express_1.Router)();
exports.infoaiRouter = infoaiRouter;
infoaiRouter.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const deviceList = yield iaqVentConInfo(14430);
        console.log(deviceList);
        res.render("infoai", { deviceList: deviceList });
    });
});
const iaqVentConInfo = (memberIdx) => __awaiter(void 0, void 0, void 0, function* () {
    const memberDeviceControlManageRepository = database_1.AppDataSource.getRepository(MemberDeviceControlManage_1.MemberDeviceControlManage);
    const result = yield memberDeviceControlManageRepository
        .createQueryBuilder("A")
        .innerJoin(MemberDeviceManage_1.MemberDeviceManage, "B", "A.iaq_device_idx = B.device_idx")
        .innerJoin(Device_1.Device, "C", "A.ventDeviceIdx = C.idx")
        .where("A.memberIdx = :memberIdx", { memberIdx })
        .groupBy("A.iaq_device_idx")
        .select([
        "A.iaq_device_idx AS iaq_device_idx",
        `JSON_ARRAYAGG(
        JSON_OBJECT(
          'vent_device_idx', A.ventDeviceIdx,
          'station_name', B.station_name,
          CASE
            WHEN C.serial_num LIKE 'CON%' THEN 'conSerialNum'
            WHEN C.serial_num LIKE 'KWV%' THEN 'ventSerialNum'
            ELSE 'serialNum'
          END, C.serial_num
        )
      ) AS sensor_list`
    ])
        .getRawMany();
    // JSON 문자열을 파싱하여 객체로 변환
    return result.map((row) => ({
        iaq_device_idx: row.iaq_device_idx,
        sensor_list: typeof row.sensor_list === 'string'
            ? JSON.parse(row.sensor_list)
            : row.sensor_list
    }));
});
exports.iaqVentConInfo = iaqVentConInfo;
infoaiRouter.post("/chartdata", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        console.log("comm");
        console.log(body);
        let startDate = body.startDate; // "YYYY-MM-DD HH:mm:ss"
        // 입력한 날짜시간값을 moment 객체로 파싱 (형식: "YYYY-MM-DD HH:mm:ss")
        const baseMoment = moment_timezone_1.default.tz(startDate, "YYYY-MM-DD HH:mm:ss", 'Asia/Seoul');
        // sMomentWatt: 입력한 날짜시간값 (그대로)
        const sMomentWatt = baseMoment.clone();
        // eMomentWatt: 입력한 날짜시간값의 +1시간
        const eMomentWatt = baseMoment.clone().add(1, 'hour');
        // sMomentPredWatt: 입력한 날짜시간값의 -1시간
        const sMomentPredWatt = baseMoment.clone().subtract(1, 'hour');
        // eMomentPredWatt: 입력한 날짜시간값의 +1시간
        const eMomentPredWatt = baseMoment.clone();
        const ventSerialNum = body.ventSerialNum;
        const conSerialNum = body.conSerialNum;
        // 형식 변환: "YYYY/MM/DD-HH:mm:ss" 형식으로 변환
        const startTime = sMomentWatt.format("YYYY/MM/DD-HH:mm:ss");
        const endTime = eMomentWatt.format("YYYY/MM/DD-HH:mm:ss");
        const startTimePred = sMomentPredWatt.format("YYYY/MM/DD-HH:mm:ss");
        const endTimePred = eMomentPredWatt.format("YYYY/MM/DD-HH:mm:ss");
        const downSample = body.downSample || "1m-avg-none";
        const sensor = "watt";
        const sensorPred = "pred_watt";
        console.log(startTime, endTime, startTimePred, endTimePred);
        const ventWattData = yield (0, tsdbData_1.getTSDBVentData)(startTime, endTime, downSample, sensor, ventSerialNum);
        // console.log("ventWattData : " , ventWattData);
        let conWattData = yield (0, tsdbData_1.getTSDBVentData)(startTime, endTime, downSample, sensor, conSerialNum);
        // conWattData 평균 보간 처리
        conWattData = interpolateConWattData(conWattData);
        console.log("conWattData : ", conWattData);
        const ventPredWattData = yield (0, tsdbData_1.getTSDBVentData)(startTimePred, endTimePred, downSample, sensorPred, ventSerialNum);
        const conPredWattData = yield (0, tsdbData_1.getTSDBVentData)(startTimePred, endTimePred, downSample, sensorPred, conSerialNum);
        res.json({ ventWattData, conWattData, ventPredWattData, conPredWattData });
        // res.json({ventWattData});
    });
});
/**
 * conWattData 평균 보간 함수
 * 0에서 0이 아닌 값으로 변할 때, 그 구간의 모든 값을 평균값으로 채움
 * 예: 19:01~19:09가 0이고 19:10이 100이면, 19:01~19:10까지 각각 10으로 설정
 */
function interpolateConWattData(data) {
    if (!data || data.length === 0)
        return data;
    // 시간 순서로 정렬
    const sortedData = [...data].sort((a, b) => {
        const timeA = moment_timezone_1.default.tz(a.time, "YYYYMMDDHHmmss", 'Asia/Seoul');
        const timeB = moment_timezone_1.default.tz(b.time, "YYYYMMDDHHmmss", 'Asia/Seoul');
        return timeA.valueOf() - timeB.valueOf();
    });
    const result = [];
    let i = 0;
    while (i < sortedData.length) {
        const current = sortedData[i];
        // 현재 값이 0이 아니면 그대로 추가
        if (current.value !== 0) {
            result.push(current);
            i++;
            continue;
        }
        // 현재 값이 0인 경우, 연속된 0 구간 찾기
        const zeroStartIndex = i;
        let zeroEndIndex = i;
        // 연속된 0 값들 찾기 (zeroEndIndex는 마지막 0 값의 인덱스)
        while (zeroEndIndex < sortedData.length && sortedData[zeroEndIndex].value === 0) {
            zeroEndIndex++;
        }
        // zeroEndIndex는 이제 첫 번째 0이 아닌 값의 인덱스 또는 배열 끝
        // 0 구간 다음에 0이 아닌 값이 있는지 확인
        if (zeroEndIndex < sortedData.length && sortedData[zeroEndIndex].value !== 0) {
            const nextNonZeroValue = sortedData[zeroEndIndex].value;
            const zeroStartTime = moment_timezone_1.default.tz(sortedData[zeroStartIndex].time, "YYYYMMDDHHmmss", 'Asia/Seoul');
            const nextNonZeroTime = moment_timezone_1.default.tz(sortedData[zeroEndIndex].time, "YYYYMMDDHHmmss", 'Asia/Seoul');
            // 분 단위 차이 계산 (0 시작부터 0이 아닌 값까지 포함)
            const minutesDiff = nextNonZeroTime.diff(zeroStartTime, 'minutes') + 1;
            if (minutesDiff > 0) {
                // 평균값 계산
                const avgValue = nextNonZeroValue / minutesDiff;
                // 0 구간부터 0이 아닌 값까지 모든 값을 평균값으로 설정
                for (let j = zeroStartIndex; j <= zeroEndIndex; j++) {
                    result.push({
                        time: sortedData[j].time,
                        value: avgValue
                    });
                }
                i = zeroEndIndex + 1;
            }
            else {
                // 분 차이가 없으면 그대로 추가
                result.push(current);
                i++;
            }
        }
        else {
            // 0 구간 다음에 0이 아닌 값이 없으면 그대로 추가
            for (let j = zeroStartIndex; j < zeroEndIndex; j++) {
                result.push(sortedData[j]);
            }
            i = zeroEndIndex;
        }
    }
    return result;
}
//# sourceMappingURL=infoai.js.map