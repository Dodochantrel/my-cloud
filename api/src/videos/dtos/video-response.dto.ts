import { ApiProperty } from '@nestjs/swagger';
import { Video, VideoGenre } from '../video.entity';

export class VideoResponseDto {
  @ApiProperty({
    description: 'Id de the movie db',
    example: 123456,
  })
  id: number;

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
    description: 'Le titre du film ou de la série',
    example: 'Inception',
  })
  title: string;

  @ApiProperty({
    description: 'Le type de contenu (film ou série)',
    example: 'movie',
  })
  type: string;

  @ApiProperty({
    description: 'Le genre de contenu (film ou série)',
    example: 'movie',
  })
  genre: VideoGenre | null;

  @ApiProperty({
    description: 'La date de sortie du film ou de la série',
    example: '2010-07-16',
  })
  releaseDate: string;

  @ApiProperty({
    description: 'Le résumé du film ou de la série',
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
  })
  description: string;

  @ApiProperty({
    description: "L'url de l'image du film ou de la série",
    example: 'Inception',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'La date de visionnage',
    example: '2023-10-01',
  })
  dateSeen: Date | null;
}

export const mapFormVideoToVideoResponseDto = (
  video: Video,
): VideoResponseDto => {
  return {
    id: video.id,
    isFavorite: video.isFavorite,
    isSeen: video.isSeen,
    isToWatch: video.isToWatch,
    rating: video.rating,
    title: video.title,
    type: video.type,
    releaseDate: video.releaseDate,
    description: video.description,
    fileUrl: video.fileUrl,
    dateSeen: video.dateSeen,
    genre: video.genre,
  };
};

export const mapFormVideoToVideoResponseDtos = (
  videos: Video[],
): VideoResponseDto[] => {
  return videos.map((video) => mapFormVideoToVideoResponseDto(video));
};
