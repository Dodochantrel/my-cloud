import { ApiProperty } from '@nestjs/swagger';
import { Tasting } from '../tasting.entity';

export class TastingResponseDto {
  @ApiProperty({
    description: 'The id of the tasting',
    example: 1,
    required: true,
  })
  id: number;

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
    description: 'The rating of the tasting',
    example: 4,
    required: false,
  })
  rating: number;
}

export const mapFromTastingToDto = (tasting: Tasting): TastingResponseDto => {
  const dto = new TastingResponseDto();
  dto.id = tasting.id;
  dto.name = tasting.name;
  dto.description = tasting.description;
  dto.rating = tasting.rating;
  return dto;
};

export const mapFromTastingsToDtos = (
  tastings: Tasting[],
): TastingResponseDto[] => {
  return tastings.map(mapFromTastingToDto);
};
