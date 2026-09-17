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
exports.getTSDBVentData = void 0;
const axiosinstance_1 = __importDefault(require("../lib/axiosinstance"));
const time_1 = require("./utils/time");
const getTSDBVentData = (startDate, endDate, downSample, sensor, serialNum) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("시작일 : " , (startDate));
    // console.log("끝일 : " ,(endDate));
    // console.log("센서 : " ,(sensor));
    // console.log("시리얼번호 : " ,(serialNum));
    var _a, _b;
    const body = {
        timezone: 'Asia/Seoul',
        useCalendar: true,
        start: startDate,
        end: endDate,
        queries: [
            {
                downsample: downSample ? downSample : '1m-avg-none',
                aggregator: 'sum',
                metric: `kw-vent-sensor-kiot.${serialNum}`,
                tags: {
                    sensor: sensor,
                },
            },
        ],
    };
    // console.log("body : " , body);
    const resp = yield axiosinstance_1.default.post(`${process.env.TSDB_URL}/api/query`, body, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    let data = resp.data;
    const results = [];
    if (!Array.isArray(data)) {
        console.error("TSDB response is not an array:", data);
        return results;
    }
    // console.log("TSDB response array length:", data.length);
    for (const row of data) {
        const sensor = String((_b = (_a = row === null || row === void 0 ? void 0 : row.tags) === null || _a === void 0 ? void 0 : _a.sensor) !== null && _b !== void 0 ? _b : '');
        // console.log("Processing row with sensor:", sensor);
        // console.log("Row dps keys count:", row?.dps ? Object.keys(row.dps).length : 0);
        // if (!sensor) {
        //     console.warn("Row has no sensor tag, skipping:", row);
        //     continue;
        // }
        if (!(row === null || row === void 0 ? void 0 : row.dps) || Object.keys(row.dps).length === 0) {
            // console.warn("Row has no dps data:", row);
            continue;
        }
        for (const [ts, val] of Object.entries(row.dps)) {
            let timeStr = '';
            if (sensor === 'watt') {
                timeStr = (0, time_1.unixToYYYYMMDDHHMMSS_KST)(Number(ts));
            }
            else {
                timeStr = (0, time_1.unixToYYYYMMDDHHMMSS_KST)(Number(ts), 1);
            }
            results.push({
                time: timeStr,
                value: Number(val),
            });
        }
    }
    return results;
});
exports.getTSDBVentData = getTSDBVentData;
//# sourceMappingURL=tsdbData.js.map