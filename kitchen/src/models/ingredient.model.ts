import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeIngredient } from "./recipe-ingredient.model";

@Entity('ingredients')
export class Ingredient {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @OneToMany(() => RecipeIngredient, recipeIngredient => recipeIngredient.ingredient)
    recipeIngredients!: RecipeIngredient[];
}
