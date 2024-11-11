import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IngredientDto } from './ingredient.dto';

export enum Ingredient {
  TOMATO = 'tomato',
  LEMON = 'lemon',
  POTATO = 'potato',
  RICE = 'rice',
  KETCHUP = 'ketchup',
  LETTUCE = 'lettuce',
  ONION = 'onion',
  CHEESE = 'cheese',
  MEAT = 'meat',
  CHICKEN = 'chicken'
}

export class CreateRecipeDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];
}
