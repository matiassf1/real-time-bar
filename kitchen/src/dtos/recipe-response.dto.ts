import { Ingredient } from "./create-recipe.dto";

export class RecipeResponseDto {
  id!: number;
  name!: string;
  description?: string;
  ingredients!: Ingredient[];
}
