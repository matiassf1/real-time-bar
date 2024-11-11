"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const axios_1 = __importDefault(require("axios"));
class WarehouseService {
    constructor() {
        this.baseURL = process.env.STORE_URL || "http://localhost:3002";
    }
    async getIngredients(recipeIngredients) {
        console.log("### Required Recipes", recipeIngredients);
        try {
            const response = await axios_1.default.post(`${this.baseURL}/stock/check-ingredients`, {
                recipeIngredients
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("### WAREHOUSE REQUEST INGREDIENTS RESPONSE", response.data);
            return response.data;
        }
        catch (error) {
            console.error("Error sending ingredients for dish order:", error);
            throw new Error("Could not send ingredients for dish order");
        }
    }
}
exports.WarehouseService = WarehouseService;
