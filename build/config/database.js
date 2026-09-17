"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    synchronize: false,
    cache: false,
    entities: [`${__dirname}/../src/entities/*.{j,t}s`],
    migrations: [`${__dirname}/../src/migrations/*.{j,t}s`],
    subscribers: [],
    poolSize: 10,
    timezone: "Z",
    logging: false,
});
//# sourceMappingURL=database.js.map