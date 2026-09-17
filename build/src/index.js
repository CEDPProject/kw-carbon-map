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
exports.server = void 0;
const database_1 = require("../config/database");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
require("reflect-metadata");
const express_session_1 = __importDefault(require("express-session"));
// router import
const info_1 = require("./routes/api/info");
const infoai_1 = require("./routes/api/infoai");
const control_1 = require("./routes/api/control");
//DB 설정 및 init , await 사용을 위해 익명함수 사용
(() => __awaiter(void 0, void 0, void 0, function* () {
    const initMysql = () => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.AppDataSource.initialize();
        console.log("\x1b[34m%s\x1b[0m", "=>   Mysql connected!");
    });
    try {
        yield initMysql(); // <--- Database connection initialized
    }
    catch (error) {
        console.log(error);
    }
}))();
const app = (0, express_1.default)();
const sessionTimeout = 1000 * 60 * 120;
const HTML = path_1.default.join(__dirname, "..", "public", "html");
const PUBLIC_DIR = path_1.default.join(__dirname, "..", "public");
// express-session 설정
app.use((0, express_session_1.default)({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: sessionTimeout },
}));
// // 모든 출처 허용 옵션. true 를 써도 된다.
app.use((0, cors_1.default)(), function (req, res, next) {
    // console.log(res);
    // console.log(req.session);
    if (req.url == "/private/inner_private" ||
        req.url == "/private/inner_service") {
        if (req.header("api-key") == "kweather") {
            next();
        }
        else {
            res.render("external_access_error.ejs");
        }
    }
    else {
        next();
    }
});
var module_files = path_1.default.join(process.cwd(), "../modules");
// body parser를 라우트 마운트 전으로 이동 (POST body 파싱)
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/info", info_1.infoRouter);
app.use("/control", control_1.controlRouter);
app.use("/infoai", infoai_1.infoaiRouter);
//app.use(methodOverride("_method"));
//app.use(express.static(path.join(__dirname, "../public")));
app.use("/modules", express_1.default.static(module_files));
app.get("/", (_req, res) => res.redirect("/monitoring"));
app.get("/monitoring", (_req, res) => {
    res.sendFile(path_1.default.join(HTML, "monitoring", "index.html"));
});
app.get("/analysis/:page(data|graph|statistics)", (req, res) => {
    res.sendFile(path_1.default.join(HTML, "analysis", `${req.params.page}.html`));
});
app.get("/analysis", (_req, res) => res.redirect("/analysis/data"));
//app.use(bodyParser.json({ limit: "50mb" })); //body 의 크기 설정
//app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); //url의 크기 설정
// app.use(logger('prd'));
app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { redirect: false }));
app.use("/", express_1.default.static(path_1.default.join(PUBLIC_DIR, "css")));
app.use("/", express_1.default.static(path_1.default.join(PUBLIC_DIR, "js")));
app.use("/", express_1.default.static(path_1.default.join(PUBLIC_DIR, "images")));
app.use("/", express_1.default.static(path_1.default.join(PUBLIC_DIR, "json")));
app.use("/", express_1.default.static(path_1.default.join(PUBLIC_DIR, "data")));
// path 요청에 따른 routes 파일 연결
app.use("/analysis/:page(data|graph|statistics)", (req, res) => {
    res.sendFile(path_1.default.join(HTML, "analysis", `${req.params.page}.html`));
});
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
const port = process.env.SERVER_PORT;
app.set("port", port);
var server = http_1.default.createServer(app);
exports.server = server;
server.listen(port);
//# sourceMappingURL=index.js.map