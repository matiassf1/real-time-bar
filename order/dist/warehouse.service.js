"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const axios_1 = __importDefault(require("axios"));
class WarehouseService {
    constructor() {
        this.baseURL = process.env.STORE_URL || "http://order-service:3002";
    }
    async buyIngredients(ingredient) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/buy?ingredient=${ingredient}`);
            return response.data;
        }
        catch (error) {
            console.error("Error creating dish order:", error);
            throw new Error("Could not create dish order");
        }
    }
    async checkIngredients(recipe) {
    }
}
exports.WarehouseService = WarehouseService;
