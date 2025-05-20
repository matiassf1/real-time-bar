import { AppDataSource } from "../config/data-source";
import { RecipeIngredient } from "../models/recipe-ingredient.model";
import { Recipe } from "../models/recipe.model";
import { Ingredient } from "../models/ingredient.model";
import { CreateRecipeDto } from "../dtos/create-recipe.dto";
import { In } from "typeorm";

export class RecipeService {
    private recipeRepository = AppDataSource.getRepository(Recipe);
    private ingredientRepository = AppDataSource.getRepository(Ingredient);

    async createOrder(recipeId: number): Promise<{ success: boolean, message: string }> {

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
        console.log("###RANDOMRECIPEID", randomRecipeId);
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
    

    async createRecipe(createRecipeDto: CreateRecipeDto) {
        const { name, ingredients, description } = createRecipeDto;
        const recipe = new Recipe();
        recipe.name = name;

        const ingredientIds = ingredients.map(ing => ing.id);
        const existingIngredients = await this.ingredientRepository.findBy({ id: In(ingredientIds) })

        if (existingIngredients.length !== ingredients.length) {
            throw new Error("One or more ingredients not found.");
        }

        recipe.ingredients = ingredients.map(({ id, quantity }) => {
            const recipeIngredient = new RecipeIngredient();
            recipeIngredient.quantity = quantity;
            recipeIngredient.ingredient = existingIngredients.find(ing => ing.id === id)!;
            return recipeIngredient;
        });

        console.log("##Description", description);

        return await this.recipeRepository.save(recipe);
    }

    private capitalize(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}
