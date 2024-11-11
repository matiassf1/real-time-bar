import { Ingredient } from "../models/ingredient.model";
import { RecipeIngredient } from "../models/recipe-ingredient.model";
import { Recipe } from "../models/recipe.model";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    entities: [
        Recipe,
        RecipeIngredient,
        Ingredient,
    ],
    logging: false,
    poolSize: 20
});
