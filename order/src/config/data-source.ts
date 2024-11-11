import { Order } from "../models/order.model";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    entities: [
        Order,
    ],
    logging: false,
    poolSize: 20,
});
