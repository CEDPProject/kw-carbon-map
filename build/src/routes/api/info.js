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
exports.infoRouter = void 0;
const express_1 = require("express");
const StationService_1 = require("../../services/StationService");
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const infoRouter = (0, express_1.Router)();
exports.infoRouter = infoRouter;
const baseUrl = "https://datacenter.kweather.co.kr/api/collection/v2/history";
const getDeviceList = (memberIdx) => __awaiter(void 0, void 0, void 0, function* () {
    const stationService = new StationService_1.StationService();
    const [deviceList] = yield stationService.getDeviceIdxList(memberIdx);
    return deviceList;
});
infoRouter.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const start = parseInt(req.query.start); // 페이지의 시작 인덱스
        const length = parseInt(req.query.length);
        //사용자 인덱스 USER_ID : iitp-livinglab
        //사용자 장비 리스트 조회
        const deviceList = yield getDeviceList(14430);
        if (!deviceList || deviceList.length === 0) {
            return res.status(404).send("No devices found for the user.");
        }
        const iaqList = deviceList.filter((d) => d.device_model.startsWith("IAQ"));
        const oaqList = deviceList.filter((d) => d.device_model.startsWith("OAQ"));
        if (iaqList.length === 0) {
            return res.status(404).send("No IAQ devices found.");
        }
        const startTime = (0, moment_1.default)().format("YYYY/MM/DD") + "-00:00:00";
        const endTime = (0, moment_1.default)().format("YYYY/MM/DD") + "-23:59:59";
        const dataMap = yield getHistoryData(startTime, endTime, iaqList[0].serial_num, oaqList[0].serial_num, iaqList[0].idx);
        //console.log(iaqData2);
        //장비별 과거 데이터 조회
        //측정장비, 환기,냉난방 장비 합치기
        const iaqData2Array = Array.from(dataMap.entries()).sort((a, b) => {
            return new Date(a[0]).getTime() - new Date(b[0]).getTime();
        });
        // 페이지네이션 처리
        //const pageData = iaqData2Array.slice(start, start + length);
        res.render("info", { iaqList, iaqData2: JSON.stringify(iaqData2Array) });
    });
});
infoRouter.get("/chartData", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const dateStr = req.query.dateStr;
        const startTime = dateStr + "-00:00:00";
        const endTime = dateStr + "-23:59:59";
        const iaqserial = req.query.iaqserial;
        const deviceList = yield getDeviceList(14430);
        const iaqList = deviceList.filter((d) => d.serial_num === iaqserial);
        const oaqList = deviceList.filter((d) => d.device_model.startsWith("OAQ"));
        const dataMap = yield getHistoryData(startTime, endTime, iaqserial, oaqList[0].serial_num, iaqList[0].idx);
        //장비별 과거 데이터 조회
        //측정장비, 환기,냉난방 장비 합치기
        const dataArray = Array.from(dataMap.entries()).sort((a, b) => {
            return new Date(a[0]).getTime() - new Date(b[0]).getTime();
        });
        res.json(dataArray);
    });
});
infoRouter.get("/tableData", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const iaqserial = req.query.iaqserial;
        const startDt = req.query.startDt + "-00:00:00";
        const endDt = req.query.endDt + "-23:59:59";
        const deviceList = yield getDeviceList(14430);
        const iaqList = deviceList.filter((d) => d.serial_num === iaqserial);
        const oaqList = deviceList.filter((d) => d.device_model.startsWith("OAQ"));
        const dataMap = yield getHistoryData(startDt, endDt, iaqserial, oaqList[0].serial_num, iaqList[0].idx);
        const dataArray = Array.from(dataMap.entries()).sort((a, b) => {
            return new Date(a[0]).getTime() - new Date(b[0]).getTime();
        });
        res.json(dataArray);
    });
});
// 과거 데이터 조회
function getHistoryData(startTime, // 시작 시간
endTime, // 종료 시간
iaqserial, // IAQ 시리얼 번호
oaqserial, // OAQ 시리얼 번호
iaqIdx // IAQ 인덱스
) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataMap = new Map();
        const stationService = new StationService_1.StationService();
        const iaqData = yield axios_1.default
            .get(`${baseUrl}?deviceType=iaq&serial=${iaqserial}&startTime=${startTime}&endTime=${endTime}&standard=sum&connect=0`)
            .then((res) => res.data.data)
            .catch((err) => {
            console.log(err);
        });
        const oaqData = yield axios_1.default
            .get(`${baseUrl}?deviceType=oaq&serial=${oaqserial}&startTime=${startTime}&endTime=${endTime}&standard=sum&connect=0`)
            .then((res) => res.data.data)
            .catch((err) => {
            console.log(err);
        });
        // console.log(iaqData.data.data);
        // console.log(oaqData.data.data);
        const ventList = yield stationService.getVentDeviceIdxList(iaqIdx);
        const ventData = yield axios_1.default
            .get(`${baseUrl}?deviceType=vent&serial=${ventList[0].serial_num}&startTime=${startTime}&endTime=${endTime}&standard=sum&connect=0`)
            .then((res) => res.data.data)
            .catch((err) => {
            console.log(err);
        });
        const conData = yield axios_1.default
            .get(`${baseUrl}?deviceType=vent&serial=${ventList[1].serial_num}&startTime=${startTime}&endTime=${endTime}&standard=sum&connect=0`)
            .then((res) => res.data.data)
            .catch((err) => {
            console.log(err);
        });
        iaqData.forEach((d) => {
            var _a;
            const sensor = {
                dataTime: d.dataTime,
                pm10: d.pm10 || "-",
                pm25: d.pm25 || "-",
                co2: d.co2 || "-",
                voc: d.voc || "-",
                temp: d.temp || "-",
                humi: d.humi || "-",
            };
            const existingData = (_a = dataMap.get(d.dataTime)) !== null && _a !== void 0 ? _a : {};
            dataMap.set(d.dataTime, Object.assign(Object.assign({}, existingData), sensor));
        });
        oaqData.forEach((d) => {
            var _a;
            const sensor = {
                dataTime: d.dataTime,
                outdoorPm10: d.pm10 || "-",
                outdoorPm25: d.pm25 || "-",
                outdoorTemp: d.temp || "-",
                outdoorHumi: d.humi || "-",
            };
            const existingData = (_a = dataMap.get(d.dataTime)) !== null && _a !== void 0 ? _a : {};
            dataMap.set(d.dataTime, Object.assign(Object.assign({}, existingData), sensor));
        });
        ventData.forEach((d) => {
            var _a;
            const sensor = {
                dataTime: d.dataTime,
                ventPower: d.power || "-",
                ventAirvolume: d.air_volume || "-",
                ventMode: d.op_mode || "-",
                ventWatt: d.watt || "-",
                ventWattHour: d.watt_hour || "-",
            };
            const existingData = (_a = dataMap.get(d.dataTime)) !== null && _a !== void 0 ? _a : {};
            dataMap.set(d.dataTime, Object.assign(Object.assign({}, existingData), sensor));
        });
        conData.forEach((d) => {
            var _a;
            const sensor = {
                dataTime: d.dataTime,
                conPower: d.power || "-",
                conMode: d.op_mode || "-",
                conAirvolume: d.air_volume || "-",
                conSetTemp: d.set_temp || "-",
                conTemp: d.con_temp || "-",
                conWatt: d.watt || "-",
                conWattHour: d.watt_hour || "-",
            };
            const existingData = (_a = dataMap.get(d.dataTime)) !== null && _a !== void 0 ? _a : {};
            dataMap.set(d.dataTime, Object.assign(Object.assign({}, existingData), sensor));
        });
        return dataMap;
    });
}
//# sourceMappingURL=info.js.map