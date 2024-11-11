// UpdateRecipeDto.ts
import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { Ingredient } from './create-recipe.dto';

export class UpdateRecipeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @IsEnum(Ingredient, { each: true })
  ingredients?: Ingredient[];
}
