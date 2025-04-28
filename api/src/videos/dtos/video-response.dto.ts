import { ApiProperty } from '@nestjs/swagger';
import { Video } from '../video.entity';
import { MovieDetails } from '../interfaces/movie-details.interface';

export class MovieDetailsDto {
  @ApiProperty({
    description: 'La durée du film ou de la série',
    example: 120,
  })
  duration: number;

  @ApiProperty({
    description: 'Le titre original du film ou de la série',
    example: 'Inception',
  })
  originalTitle: string;

  @ApiProperty({
    description: 'L accroche du film ou de la série',
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
  })
  tagline: string;
}

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
    description: 'Le genre de contenu (film ou série)',
    example: 'movie',
  })
  genre: string[];

  @ApiProperty({
    description: 'Le type de contenu (film ou série)',
    example: 'movie',
  })
  type: 'movie' | 'series';

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

  @ApiProperty({
    description: 'Les détails du film ou de la série',
    type: MovieDetailsDto,
    nullable: true,
  })
  movieDetails: MovieDetailsDto | null;
}

export const mapFromVideoToVideoResponseDto = (
  video: Video,
): VideoResponseDto => {
  return {
    id: video.tmdbId,
    isFavorite: video.isFavorite,
    isSeen: video.isSeen,
    isToWatch: video.isToWatch,
    rating: video.rating,
    title: video.title,
    releaseDate: video.releaseDate,
    description: video.description,
    fileUrl: video.fileUrl,
    dateSeen: video.dateSeen,
    genre: video.genre,
    type: video.type,
    movieDetails: video.movieDetails
      ? mapFromMovieDetailsToMovieDetailsDto(video.movieDetails)
      : null,
  };
};

export const mapFormVideoToVideoResponseDtos = (
  videos: Video[],
): VideoResponseDto[] => {
  return videos.map((video) => mapFromVideoToVideoResponseDto(video));
};

export const mapFromMovieDetailsToMovieDetailsDto = (
  movieDetails: MovieDetails,
): MovieDetailsDto => {
  return {
    duration: movieDetails.duration,
    originalTitle: movieDetails.originalTitle,
    tagline: movieDetails.tagline,
  };
};
