import { ApiProperty } from '@nestjs/swagger';
import { Recipe, RecipeType } from '../recipe.entity';

export class RecipeResponseDto {
  @ApiProperty({
    type: 'number',
    description: 'The unique identifier for the recipe',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'The name of the recipe',
    example: 'Spaghetti Bolognese',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'The description of the recipe',
    example: 'A classic Italian pasta dish with a rich meat sauce.',
  })
  description: string;

  @ApiProperty({
    type: 'string',
    description: 'The type of the recipe',
    example: 'main',
  })
  type: RecipeType;

  constructor(partial: Partial<RecipeResponseDto>) {
    Object.assign(this, partial);
  }
}

export const mapFromRecipeToRecipeResponseDto = (
  recipe: Recipe,
): RecipeResponseDto => {
  return new RecipeResponseDto({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    type: recipe.type,
  });
};
