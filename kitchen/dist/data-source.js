"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Ingredient_1 = require("./models/Ingredient");
const Recipe_1 = require("./models/Recipe");
const RecipeIngredient_1 = require("./models/RecipeIngredient");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [Recipe_1.Recipe, RecipeIngredient_1.RecipeIngredient, Ingredient_1.Ingredient],
});
