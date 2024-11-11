
import { IsString, IsInt, Min } from 'class-validator';

export class RecipeIngredientDTO {
    @IsString()
    name!: string;

    @IsInt()
    @Min(1)
    quantity!: number;
}
