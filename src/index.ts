import { AppDataSource } from "../config/database";
import express from "express";
import path from "path";
import http from "http";
import cors from "cors";
import "reflect-metadata";
import session from "express-session";
import pages from "./routes/index";

// router import
import { infoRouter } from "./routes/api/info";
import { infoaiRouter } from "./routes/api/infoai";
import { controlRouter } from "./routes/api/control";
import { kweatherRouter } from "./routes/api/kweather";

//DB 설정 및 init , await 사용을 위해 익명함수 사용
(async () => {
  const initMysql = async () => {
    await AppDataSource.initialize();
    console.log("\x1b[34m%s\x1b[0m", "=>   Mysql connected!");
  };

  try {
    await initMysql(); // <--- Database connection initialized
  } catch (error) {
    console.log(error);
  }
})();

const app = express();
const sessionTimeout = 1000 * 60 * 120;
const HTML = path.join(__dirname, "..", "public", "html");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// express-session 설정
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: sessionTimeout },
  })
);

// // 모든 출처 허용 옵션. true 를 써도 된다.
app.use(cors(), function (req, res, next) {
  // console.log(res);
  // console.log(req.session);
  if (
    req.url == "/private/inner_private" ||
    req.url == "/private/inner_service"
  ) {
    if (req.header("api-key") == "kweather") {
      next();
    } else {
      res.render("external_access_error.ejs");
    }
  } else {
    next();
  }
});

var module_files = path.join(process.cwd(), "../modules");

// body parser를 라우트 마운트 전으로 이동 (POST body 파싱)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/info", infoRouter);
app.use("/control", controlRouter);
app.use("/infoai", infoaiRouter);
app.use("/api/kweather", kweatherRouter);
//app.use(methodOverride("_method"));
//app.use(express.static(path.join(__dirname, "../public")));
app.use("/modules", express.static(module_files));

app.get("/", (_req, res) => res.redirect("/monitoring"));

app.get("/monitoring", (_req, res) => {
  res.sendFile(path.join(HTML, "monitoring", "index.html"));
});

app.get("/greenhouse", (_req, res) => {
  res.sendFile(path.join(HTML, "greenhouse", "index.html"));
});

app.get("/analysis/:page(data|graph|statistics)", (req, res) => {
  res.sendFile(path.join(HTML, "analysis", `${req.params.page}.html`));
});

app.get("/analysis", (_req, res) => res.redirect("/analysis/data"));

//app.use(bodyParser.json({ limit: "50mb" })); //body 의 크기 설정
//app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); //url의 크기 설정

// app.use(logger('prd'));

app.use(express.static(path.join(__dirname, "public"), { redirect: false }));
app.use("/", express.static(path.join(PUBLIC_DIR, "css")));
app.use("/", express.static(path.join(PUBLIC_DIR, "js")));
app.use("/", express.static(path.join(PUBLIC_DIR, "images")));
app.use("/", express.static(path.join(PUBLIC_DIR, "json")));
app.use("/", express.static(path.join(PUBLIC_DIR, "data")));

// path 요청에 따른 routes 파일 연결

app.use("/analysis/:page(data|graph|statistics)", (req, res) => {
  res.sendFile(path.join(HTML, "analysis", `${req.params.page}.html`));
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const port = process.env.SERVER_PORT;
app.set("port", port);
var server = http.createServer(app);
server.listen(port);

export { server };
