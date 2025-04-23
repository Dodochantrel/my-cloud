import { ApiProperty } from '@nestjs/swagger';
import { RecipeType } from '../recipe.entity';

export class RecipeRequestDto {
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
    description: 'Groups id of the group',
    example: [1, 2, 3],
  })
  groupsId: number[];
}
