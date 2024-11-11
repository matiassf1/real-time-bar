
import { Type } from 'class-transformer';
import { ValidateNested, ArrayNotEmpty } from 'class-validator';
import { RecipeIngredientDTO } from './recipe-ingredient.dto';

export class PrepareRecipeDTO {
    @ValidateNested({ each: true })
    @Type(() => RecipeIngredientDTO)
    @ArrayNotEmpty()
    recipeIngredients!: RecipeIngredientDTO[];
}
