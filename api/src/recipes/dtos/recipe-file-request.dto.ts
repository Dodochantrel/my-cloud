import { ApiProperty } from '@nestjs/swagger';

export class RecipeFileResponseDto {
  @ApiProperty({
    type: 'number',
    description: 'The unique identifier for the recipe',
    example: 1,
  })
  id: number;
}
