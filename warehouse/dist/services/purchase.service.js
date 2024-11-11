"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const axios_1 = __importDefault(require("axios"));
const data_source_1 = require("../config/data-source");
const purchase_model_1 = require("../models/purchase.model");
class PurchaseService {
    constructor() {
        this.purchaseRepository = data_source_1.AppDataSource.getRepository(purchase_model_1.Purchase);
    }
    async getPurchases(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const purchases = await this.purchaseRepository.find({
                order: {
                    purchaseDate: 'DESC',
                },
                skip: skip,
                take: limit,
            });
            return purchases;
        }
        catch (error) {
            console.error(`Error getting purchases list: ${error?.message}`);
            return [];
        }
    }
    async purchaseIngredients(ingredientName) {
        try {
            const response = await axios_1.default.get(`https://recruitment.alegra.com/api/farmers-market/buy?ingredient=${ingredientName}`);
            return response.data.quantitySold;
        }
        catch (error) {
            console.error(`Error purchasing ${ingredientName}: ${error?.message}`);
            return 0;
        }
    }
}
exports.PurchaseService = PurchaseService;
