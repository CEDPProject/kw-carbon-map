"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const typeorm_1 = require("typeorm");
const DeviceModel_1 = require("./DeviceModel");
let Device = class Device {
};
exports.Device = Device;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "idx" }),
    __metadata("design:type", Number)
], Device.prototype, "idx", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Device.prototype, "serial_num", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => DeviceModel_1.DeviceModel, (deviceModel) => deviceModel.device),
    __metadata("design:type", DeviceModel_1.DeviceModel)
], Device.prototype, "device_model", void 0);
exports.Device = Device = __decorate([
    (0, typeorm_1.Entity)("TB_DEVICE")
], Device);
//# sourceMappingURL=Device.js.map