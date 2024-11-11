"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const order_model_1 = require("../models/order.model");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123123",
    database: "alegra",
    synchronize: true,
    entities: [
        order_model_1.Order,
    ],
    logging: false,
    poolSize: 20
});
