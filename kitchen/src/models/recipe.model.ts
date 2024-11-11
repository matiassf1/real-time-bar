import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeIngredient } from "./recipe-ingredient.model";

@Entity('recipes')
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => RecipeIngredient, recipeIngredient => recipeIngredient.recipe, { cascade: true })
    ingredients!: RecipeIngredient[];
}
