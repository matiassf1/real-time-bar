import { Purchase } from "../models/purchase.model";
import { Stock } from "../models/stock.model";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    entities: [
        Purchase,
        Stock,
    ],
    logging: false,
    poolSize: 20
})