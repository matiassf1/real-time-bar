"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const data_source_1 = require("../config/data-source");
const purchase_model_1 = require("../models/purchase.model");
const stock_model_1 = require("../models/stock.model");
const purchase_service_1 = require("./purchase.service");
const stock_messages_1 = require("../messages/stock.messages");
class StockService {
    constructor() {
        this.purchaseService = new purchase_service_1.PurchaseService();
        this.ingredientRepository = data_source_1.AppDataSource.getRepository(stock_model_1.Stock);
        this.purchaseRepository = data_source_1.AppDataSource.getRepository(purchase_model_1.Purchase);
    }
    async getStock() {
        return this.ingredientRepository.find();
    }
    async getIngredientsForRecipe(recipeIngredients) {
        for (const { ingredient: receivedIngredient, quantity } of recipeIngredients) {
            let ingredient = await this.findOrCreateIngredient(receivedIngredient.name);
            while (!ingredient.hasStock(quantity)) {
                const restockedIngredient = await this.replenishStock(ingredient);
                if (restockedIngredient !== null) {
                    await (0, stock_messages_1.publishStockUpdate)(restockedIngredient);
                }
            }
            const consumedIngredient = await this.consumeIngredientStock(ingredient, quantity);
            await (0, stock_messages_1.publishStockUpdate)(consumedIngredient);
        }
    }
    async findOrCreateIngredient(name) {
        let ingredient = await this.ingredientRepository.findOneBy({ name });
        if (!ingredient) {
            ingredient = new stock_model_1.Stock();
            ingredient.name = name;
            ingredient.quantity = 5;
            await this.ingredientRepository.save(ingredient);
        }
        return ingredient;
    }
    async replenishStock(ingredient) {
        const purchasedQuantity = await this.purchaseService.purchaseIngredients(ingredient.name);
        if (purchasedQuantity === 0) {
            console.log(`Failed to purchase ${ingredient.name}. Not enough stock in the market.`);
            return null;
        }
        console.log(`Purchased ${purchasedQuantity} units of ${ingredient.name} from the market.`);
        ingredient.restock(purchasedQuantity);
        const restockedIngredient = await this.ingredientRepository.save(ingredient);
        const purchase = new purchase_model_1.Purchase();
        purchase.ingredientName = ingredient.name;
        purchase.quantityPurchased = purchasedQuantity;
        await this.purchaseRepository.save(purchase);
        return restockedIngredient;
    }
    async consumeIngredientStock(ingredient, quantity) {
        if (ingredient.hasStock(quantity)) {
            ingredient.quantity -= quantity;
            const consumedIngredient = await this.ingredientRepository.save(ingredient);
            console.log(`Consumed ${quantity} units of ${ingredient.name}. Remaining stock: ${ingredient.quantity}`);
            return consumedIngredient;
        }
        else {
            console.error(`Insufficient stock for ${ingredient.name}. Required: ${quantity}, Available: ${ingredient.quantity}`);
            throw new Error(`Insufficient stock for ${ingredient.name}`);
        }
    }
}
exports.StockService = StockService;
