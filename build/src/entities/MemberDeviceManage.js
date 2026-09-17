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
exports.MemberDeviceManage = void 0;
const typeorm_1 = require("typeorm");
let MemberDeviceManage = class MemberDeviceManage {
};
exports.MemberDeviceManage = MemberDeviceManage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "device_idx" }),
    __metadata("design:type", Number)
], MemberDeviceManage.prototype, "device_idx", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "member_idx" }),
    __metadata("design:type", Number)
], MemberDeviceManage.prototype, "memberIdx", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "station_name" }),
    __metadata("design:type", String)
], MemberDeviceManage.prototype, "station_name", void 0);
exports.MemberDeviceManage = MemberDeviceManage = __decorate([
    (0, typeorm_1.Entity)("TB_MEMBER_DEVICE_MANAGE")
], MemberDeviceManage);
//# sourceMappingURL=MemberDeviceManage.js.map