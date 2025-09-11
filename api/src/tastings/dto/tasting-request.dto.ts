import { ApiProperty } from '@nestjs/swagger';

export class TastingRequestDto {
  @ApiProperty({
    description: 'The name of the tasting',
    example: 'Tasting of the best beers',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'The description of the tasting',
    example: 'A detailed description of the tasting event',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'The category of the tasting',
    example: 1,
    required: true,
  })
  categoryId: string;

  @ApiProperty({
    description: 'The rating of the tasting',
    example: 4,
    required: false,
  })
  rating: number;
}
