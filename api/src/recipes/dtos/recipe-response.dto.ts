import { ApiProperty } from '@nestjs/swagger';
import { Recipe, RecipeType } from '../recipe.entity';
import {
  mapFromUserToUserResponseDto,
  UserResponseDto,
} from 'src/users/dtos/user-response.dto';
import {
  GroupResponseDto,
  mapFromGroupsToGroupsResponseDto,
} from 'src/groups/dtos/group-response.dto';

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

  @ApiProperty({
    type: 'string',
    description: 'The date when the recipe was created',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    type: 'string',
    description: 'The date when the recipe was last updated',
    example: '2023-10-01T12:00:00Z',
  })
  updatedAt: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'The user who created the recipe',
  })
  user: UserResponseDto;

  @ApiProperty({
    type: 'array',
    description: 'The groups associated with the recipe',
  })
  groups: GroupResponseDto[];

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
    createdAt: recipe.createdAt ? recipe.createdAt.toISOString() : null,
    updatedAt: recipe.updatedAt ? recipe.updatedAt.toISOString() : null,
    user: mapFromUserToUserResponseDto(recipe.user),
    groups: mapFromGroupsToGroupsResponseDto(recipe.groups),
  });
};

export const mapFromRecipesToRecipesResponseDto = (
  recipes: Recipe[],
): RecipeResponseDto[] => {
  return recipes.map((recipe) => mapFromRecipeToRecipeResponseDto(recipe));
};
