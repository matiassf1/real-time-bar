import { IsInt, Min } from 'class-validator';

export class IngredientDto {
  @IsInt()
  id!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}
