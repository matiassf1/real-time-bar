"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeService = void 0;
const data_source_1 = require("../config/data-source");
const recipe_ingredient_model_1 = require("../models/recipe-ingredient.model");
const recipe_model_1 = require("../models/recipe.model");
const ingredient_model_1 = require("../models/ingredient.model");
const typeorm_1 = require("typeorm");
class RecipeService {
    constructor() {
        this.recipeRepository = data_source_1.AppDataSource.getRepository(recipe_model_1.Recipe);
        this.ingredientRepository = data_source_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
    }
    async createOrder(recipeId) {
        const recipe = await this.recipeRepository.findOne({
            where: { id: recipeId },
            relations: ['ingredients', 'ingredients.ingredient'],
        });
        if (!recipe) {
            throw new Error(`Recipe with ID ${recipeId} not found.`);
        }
        return { success: true, message: "Order processed successfully" };
    }
    async getOneRandomRecipe() {
        const randomRecipeId = await this.recipeRepository
            .createQueryBuilder("recipe")
            .select("recipe.id")
            .orderBy("RANDOM()")
            .limit(1)
            .getRawOne();
        if (!randomRecipeId) {
            throw new Error("No recipes found.");
        }
        const recipe = await this.recipeRepository.findOne({
            where: { id: randomRecipeId.recipe_id },
            relations: ["ingredients", "ingredients.ingredient"],
        });
        console.log("###RECIPE", recipe);
        return recipe;
    }
    async getAllRecipes() {
        const recipes = await this.recipeRepository
            .createQueryBuilder('recipe')
            .leftJoinAndSelect('recipe.ingredients', 'recipeIngredients')
            .leftJoinAndSelect('recipeIngredients.ingredient', 'ingredient')
            .getMany();
        return recipes.map(recipe => ({
            name: recipe.name,
            ingredients: recipe.ingredients.map(recipeIngredient => ({
                name: this.capitalize(recipeIngredient.ingredient.name),
                quantity: `${recipeIngredient.quantity * 100} g`,
            })),
        }));
    }
    async createRecipe(createRecipeDto) {
        const { name, ingredients, description } = createRecipeDto;
        const recipe = new recipe_model_1.Recipe();
        recipe.name = name;
        const ingredientIds = ingredients.map(ing => ing.id);
        const existingIngredients = await this.ingredientRepository.findBy({ id: (0, typeorm_1.In)(ingredientIds) });
        if (existingIngredients.length !== ingredients.length) {
            throw new Error("One or more ingredients not found.");
        }
        recipe.ingredients = ingredients.map(({ id, quantity }) => {
            const recipeIngredient = new recipe_ingredient_model_1.RecipeIngredient();
            recipeIngredient.quantity = quantity;
            recipeIngredient.ingredient = existingIngredients.find(ing => ing.id === id);
            return recipeIngredient;
        });
        console.log("##Description", description);
        return await this.recipeRepository.save(recipe);
    }
    capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}
exports.RecipeService = RecipeService;
