"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitchenService = void 0;
const axios_1 = __importDefault(require("axios"));
class KitchenService {
    constructor() {
        this.baseURL = process.env.KITCHEN_URL || "http://localhost:3001";
    }
    async prepareDishOrder(dishOrderDto) {
        console.log("### dishOrderDto", dishOrderDto);
        try {
            const response = await axios_1.default.post(`${this.baseURL}/recipes/orders`, {
                ...dishOrderDto
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error("Error preparing dish order:", error);
            throw new Error("Could not preparing dish order ##APIGATEWAY");
        }
    }
    async getDishRecipe() {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/recipes/random`);
            return response.data;
        }
        catch (error) {
            console.error("Error getting dish recipe:", error);
            throw new Error("Could not get dish recipe ##APIGATEWAY");
        }
    }
}
exports.KitchenService = KitchenService;
