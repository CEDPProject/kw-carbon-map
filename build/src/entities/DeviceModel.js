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
exports.DeviceModel = void 0;
const typeorm_1 = require("typeorm");
const Device_1 = require("./Device");
let DeviceModel = class DeviceModel {
};
exports.DeviceModel = DeviceModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "idx" }),
    __metadata("design:type", Number)
], DeviceModel.prototype, "idx", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeviceModel.prototype, "device_model", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Device_1.Device, (device) => device.device_model),
    __metadata("design:type", Device_1.Device)
], DeviceModel.prototype, "device", void 0);
exports.DeviceModel = DeviceModel = __decorate([
    (0, typeorm_1.Entity)("TB_DEVICE_MODEL")
], DeviceModel);
//# sourceMappingURL=DeviceModel.js.map