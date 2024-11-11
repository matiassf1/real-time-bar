import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Ingredient } from "./ingredient.model";
import { Recipe } from "./recipe.model";

@Entity('recipes_ingredients')
export class RecipeIngredient {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Recipe, recipe => recipe.ingredients)
    recipe!: Recipe;

    @ManyToOne(() => Ingredient, ingredient => ingredient.recipeIngredients)
    ingredient!: Ingredient;

    @Column()
    quantity!: number;
}
