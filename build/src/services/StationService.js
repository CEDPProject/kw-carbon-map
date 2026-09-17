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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationService = void 0;
const database_1 = require("../../config/database");
const Device_1 = require("../entities/Device");
const MemberDeviceManage_1 = require("../entities/MemberDeviceManage");
const Member_1 = require("../entities/Member");
const MemberDeviceControlManage_1 = require("../entities/MemberDeviceControlManage");
const DeviceModel_1 = require("../entities/DeviceModel");
class StationService {
    constructor() {
        this.deviceRepository = database_1.AppDataSource.getRepository(Device_1.Device);
        this.memberRepository = database_1.AppDataSource.getRepository(Member_1.Member);
        this.memberDeviceManageRepository = database_1.AppDataSource.getRepository(MemberDeviceManage_1.MemberDeviceManage);
        this.memberDeviceControlManageRepository = database_1.AppDataSource.getRepository(MemberDeviceControlManage_1.MemberDeviceControlManage);
    }
    getDeviceIdxList(memberIdx) {
        return __awaiter(this, void 0, void 0, function* () {
            const [device] = yield Promise.all([
                this.deviceRepository
                    .createQueryBuilder("device")
                    .innerJoin(DeviceModel_1.DeviceModel, "deviceModel", "device.device_model_idx = deviceModel.idx")
                    .where((qb) => {
                    const subQuery = qb
                        .subQuery()
                        .select("mdm.device_idx")
                        .from(MemberDeviceManage_1.MemberDeviceManage, "mdm")
                        .where("mdm.member_idx = :memberIdx", { memberIdx: memberIdx })
                        .getQuery();
                    return "device.idx IN " + subQuery;
                })
                    //.andWhere("device.device_type_idx = 1")
                    .select([
                    "device.idx AS idx",
                    `(SELECT mdm.station_name FROM TB_MEMBER_DEVICE_MANAGE mdm WHERE mdm.device_idx = device.idx LIMIT 1) AS station_name`,
                    "device.serial_num AS serial_num",
                    "deviceModel.device_model AS device_model",
                ])
                    .orderBy("device.idx", "ASC")
                    .getRawMany(),
            ]);
            return [device];
        });
    }
    getVentDeviceIdxList(iaqIdx) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.deviceRepository
                .createQueryBuilder("device")
                .innerJoin(DeviceModel_1.DeviceModel, "deviceModel", "device.device_model_idx = deviceModel.idx")
                .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("mdcm.vent_device_idx")
                    .from(MemberDeviceControlManage_1.MemberDeviceControlManage, "mdcm")
                    .where("mdcm.iaq_device_idx = :iaqIdx", { iaqIdx })
                    .getQuery();
                return "device.idx IN " + subQuery;
            })
                .select([
                "device.idx AS idx",
                "device.serial_num AS serial_num",
                "deviceModel.device_model AS device_model",
                `(SELECT mdm.station_name FROM TB_MEMBER_DEVICE_MANAGE mdm WHERE mdm.device_idx = device.idx LIMIT 1) AS station_name`,
            ])
                .getRawMany();
            return device;
        });
    }
}
exports.StationService = StationService;
//# sourceMappingURL=StationService.js.map