import express from 'express';
import { RecipeController } from '../controllers/recipe.controller';

const router = express.Router();
const recipeController = new RecipeController();

router.get("/random", recipeController.getOneRandomRecipe.bind(recipeController));
router.get("/", recipeController.getAllRecipes.bind(recipeController));
router.post('/orders', recipeController.createOrder.bind(recipeController));
router.post("/", recipeController.createRecipe.bind(recipeController));

export default router;
