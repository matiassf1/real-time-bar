"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const purchase_model_1 = require("../models/purchase.model");
const stock_model_1 = require("../models/stock.model");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    entities: [
        purchase_model_1.Purchase,
        stock_model_1.Stock,
    ],
    logging: false,
    poolSize: Number(process.env.DB_POOL_SIZE),
});
