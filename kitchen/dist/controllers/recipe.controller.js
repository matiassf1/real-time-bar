"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const recipe_service_1 = require("../services/recipe.service");
const create_recipe_dto_1 = require("../dtos/create-recipe.dto");
class RecipeController {
    constructor() {
        this.recipeService = new recipe_service_1.RecipeService();
    }
    async validateDto(dto, res) {
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {}).join(", "));
            res.status(400).json({ message: "Validation failed", errors: messages });
            return false;
        }
        return true;
    }
    async createOrder(req, res) {
        try {
            const result = await this.recipeService.createOrder(req.body.recipeId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("Error processing order:", error);
            res.status(500).json({ message: error.message });
        }
    }
    async getOneRandomRecipe(req, res) {
        try {
            const recipe = await this.recipeService.getOneRandomRecipe();
            res.status(200).json(recipe);
        }
        catch (error) {
            console.error("Error fetching recipes:", error);
            res.status(500).json({ message: "Could not fetch recipes" });
        }
    }
    async getAllRecipes(req, res) {
        try {
            const recipes = await this.recipeService.getAllRecipes();
            res.status(200).json(recipes);
        }
        catch (error) {
            console.error("Error fetching recipes:", error);
            res.status(500).json({ message: "Could not fetch recipes" });
        }
    }
    async createRecipe(req, res) {
        const createRecipeDto = (0, class_transformer_1.plainToInstance)(create_recipe_dto_1.CreateRecipeDto, req.body);
        if (!(await this.validateDto(createRecipeDto, res)))
            return;
        try {
            const newRecipe = await this.recipeService.createRecipe(createRecipeDto);
            res.status(201).json(newRecipe);
        }
        catch (error) {
            console.error("Error creating recipe:", error);
            res.status(500).json({ message: "Could not create recipe" });
        }
    }
}
exports.RecipeController = RecipeController;
