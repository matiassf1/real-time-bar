"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const class_validator_1 = require("class-validator");
const stock_service_1 = require("../services/stock.service");
const prepare_recipe_dto_1 = require("../dtos/prepare-recipe.dto");
const src_1 = require("../../src");
const stock_messages_1 = require("../messages/stock.messages");
class StockController {
    constructor() {
        this.stockService = new stock_service_1.StockService();
        this.prepareIngredients = this.prepareIngredients.bind(this);
        this.getStock = this.getStock.bind(this);
    }
    async prepareIngredients(req, res) {
        const prepareRecipeDto = Object.assign(new prepare_recipe_dto_1.PrepareRecipeDTO(), req.body);
        const errors = await (0, class_validator_1.validate)(prepareRecipeDto);
        if (errors.length > 0) {
            res.status(400).json({ errors: errors.map(e => e.toString()) });
            return;
        }
        stock_messages_1.globalSubscribers.add(src_1.initializer);
        try {
            await this.stockService.getIngredientsForRecipe(prepareRecipeDto.recipeIngredients);
            res.status(200).json({ message: 'Ingredients ready for recipe preparation.' });
        }
        catch (error) {
            console.error('Error preparing recipe:', error);
            res.status(500).json({ error: 'Failed to prepare ingredients for recipe' });
        }
    }
    async getStock(req, res) {
        try {
            const stock = await this.stockService.getStock();
            res.status(200).json({ stock });
        }
        catch (error) {
            console.error('Error getting stock of ingredients', error);
            res.status(500).json({ error: 'Failed to get ingredients in stock' });
        }
    }
}
exports.StockController = StockController;
