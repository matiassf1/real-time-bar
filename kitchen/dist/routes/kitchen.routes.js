"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const recipe_service_1 = require("../services/recipe.service");
const create_recipe_dto_1 = require("../dtos/create-recipe.dto");
const router = express_1.default.Router();
const recipeService = new recipe_service_1.RecipeService();
// Helper function to handle validation errors
const validateDto = async (dto, res) => {
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length > 0) {
        const messages = errors.map(err => Object.values(err.constraints || {}).join(", "));
        res.status(400).json({ message: "Validation failed", errors: messages });
        return false;
    }
    return true;
};
// GET all recipes
router.get("/", async (req, res) => {
    try {
        const recipes = await recipeService.getAllRecipes();
        res.json(recipes);
    }
    catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Could not fetch recipes" });
    }
});
router.post("/", async (req, res) => {
    const createRecipeDto = (0, class_transformer_1.plainToInstance)(create_recipe_dto_1.CreateRecipeDto, req.body);
    if (!(await validateDto(createRecipeDto, res)))
        return;
    try {
        const newRecipe = await recipeService.createRecipe(createRecipeDto);
        res.status(201).json(newRecipe);
    }
    catch (error) {
        console.error("Error creating recipe:", error);
        res.status(500).json({ message: "Could not create recipe" });
    }
});
exports.default = router;
