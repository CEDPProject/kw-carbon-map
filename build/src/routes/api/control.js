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
exports.controlRouter = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const CommandScheduler_1 = require("../../services/CommandScheduler");
const controlRouter = (0, express_1.Router)();
exports.controlRouter = controlRouter;
// 명령어 JSON 로드 (public/json/control.json)
function loadCommands() {
    const filePath = path_1.default.join(process.cwd(), "public", "json", "control.json");
    return JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
}
// 페이지 렌더링 — totalCount를 EJS에 전달
controlRouter.get("/", function (_req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalCount = loadCommands().length;
        res.render("control", { totalCount });
    });
});
// 명령어 리스트 반환
controlRouter.get("/commands", function (_req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = loadCommands();
        res.json(commands);
    });
});
// 스케줄러 상태 반환 (폴링용)
controlRouter.get("/status", function (_req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json(CommandScheduler_1.commandScheduler.getStatus());
    });
});
// 자동 전송 시작 (재시작 포함)
controlRouter.post("/start", function (req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startIndex, endIndex, intervalMinutes } = req.body;
        const total = loadCommands().length;
        if (!startIndex || startIndex < 1 || startIndex > total) {
            return res.status(400).json({ message: `시작 번호는 1~${total} 사이여야 합니다.` });
        }
        const end = endIndex !== null && endIndex !== void 0 ? endIndex : total;
        if (end < 1 || end > total || end < startIndex) {
            return res.status(400).json({ message: `종료 번호는 ${startIndex}~${total} 사이여야 합니다.` });
        }
        const interval = parseInt(intervalMinutes);
        if (isNaN(interval) || interval < 10 || interval > 240 || interval % 10 !== 0) {
            return res.status(400).json({ message: "전송 간격은 10~240분 사이의 10분 단위여야 합니다." });
        }
        const intervalMs = interval * 60 * 1000;
        // 실행은 백그라운드에서 — await 하지 않아야 isRunning 상태를 폴링으로 관찰 가능
        CommandScheduler_1.commandScheduler.start(startIndex, end, intervalMs).catch((err) => {
            console.error("[Control] 스케줄러 시작 실패:", err);
        });
        // 스케줄러가 isRunning = true로 전환될 시간을 잠깐 대기 후 응답
        yield new Promise((r) => setTimeout(r, 80));
        res.json(CommandScheduler_1.commandScheduler.getStatus());
    });
});
// 전송 종료
controlRouter.post("/stop", function (_req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        CommandScheduler_1.commandScheduler.stop();
        res.json(CommandScheduler_1.commandScheduler.getStatus());
    });
});
// 단일 명령어 수동 전송 (테스트용)
controlRouter.post("/send/:id", function (req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const total = loadCommands().length;
        if (isNaN(id) || id < 1 || id > total) {
            return res.status(400).json({ message: `명령어 ID는 1~${total} 사이여야 합니다.` });
        }
        try {
            const result = yield CommandScheduler_1.commandScheduler.sendCommand(id);
            res.json(result);
        }
        catch (err) {
            console.error("[Control] 명령어 전송 실패:", err);
            res.status(500).json({ message: err.message || "명령어 전송 실패" });
        }
    });
});
//# sourceMappingURL=control.js.map