"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const axios_1 = __importDefault(require("axios"));
class OrderService {
    constructor() {
        this.baseURL = process.env.STORE_URL || "http://localhost:3003";
    }
    async create(dishRecipe) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/order`, { item: dishRecipe }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error("Error creating dish order:", error);
            throw new Error("Could not create dish order ### APIGATEWAY");
        }
    }
    async updateStatus(id, status) {
        try {
            const response = await axios_1.default.patch(`${this.baseURL}/order/${id}/status`, {
                status
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error("Error updating dish order status:", error);
            throw new Error("Could not update dish order status ### APIGATEWAY");
        }
    }
}
exports.OrderService = OrderService;
