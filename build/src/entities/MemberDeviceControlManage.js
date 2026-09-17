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
exports.MemberDeviceControlManage = void 0;
const typeorm_1 = require("typeorm");
let MemberDeviceControlManage = class MemberDeviceControlManage {
};
exports.MemberDeviceControlManage = MemberDeviceControlManage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "iaq_device_idx" }),
    __metadata("design:type", Number)
], MemberDeviceControlManage.prototype, "iaq_device_idx", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "member_idx" }),
    __metadata("design:type", Number)
], MemberDeviceControlManage.prototype, "memberIdx", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "vent_device_idx" }),
    __metadata("design:type", Number)
], MemberDeviceControlManage.prototype, "ventDeviceIdx", void 0);
exports.MemberDeviceControlManage = MemberDeviceControlManage = __decorate([
    (0, typeorm_1.Entity)("TB_MEMBER_DEVICE_CONTROL_MANAGE")
], MemberDeviceControlManage);
//# sourceMappingURL=MemberDeviceControlManage.js.map