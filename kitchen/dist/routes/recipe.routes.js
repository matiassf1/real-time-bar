"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipe_controller_1 = require("../controllers/recipe.controller");
const router = express_1.default.Router();
const recipeController = new recipe_controller_1.RecipeController();
router.get("/random", recipeController.getOneRandomRecipe.bind(recipeController));
router.get("/", recipeController.getAllRecipes.bind(recipeController));
router.post('/orders', recipeController.createOrder.bind(recipeController));
router.post("/", recipeController.createRecipe.bind(recipeController));
exports.default = router;
