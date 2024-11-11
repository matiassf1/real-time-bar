"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const ingredient_model_1 = require("../models/ingredient.model");
const recipe_ingredient_model_1 = require("../models/recipe-ingredient.model");
const recipe_model_1 = require("../models/recipe.model");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    entities: [
        recipe_model_1.Recipe,
        recipe_ingredient_model_1.RecipeIngredient,
        ingredient_model_1.Ingredient,
    ],
    logging: false,
    poolSize: Number(process.env.DB_POOL_SIZE),
});
