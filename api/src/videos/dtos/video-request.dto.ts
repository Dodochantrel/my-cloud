import { ApiProperty } from '@nestjs/swagger';

export class VideoRequestDto {
  @ApiProperty({
    description: 'Un boolean pour dire si favoris',
    example: false,
  })
  isFavorite: boolean;

  @ApiProperty({
    description: 'Un boolean pour dire si déjà vu.',
    example: false,
  })
  isSeen: boolean;

  @ApiProperty({
    description: 'Un boolean pour dire si a voir plus tard',
    example: false,
  })
  isToWatch: boolean;

  @ApiProperty({
    description: 'Un number pour la note de 1 à 5',
    example: 4,
  })
  rating: number | null;

  @ApiProperty({
    description: 'La date de visionnage',
    example: '2023-10-01',
  })
  dateSeen: Date | null;
}
