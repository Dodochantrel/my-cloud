import { ApiProperty } from '@nestjs/swagger';
import { Video, VideoType } from '../video.entity';
import { MovieDetails } from '../interfaces/movie-details.interface';
import { SerieDetails } from '../interfaces/serie-details.interface';

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

export class SerieDetailsDto {
  @ApiProperty({
    description: 'Le nombre de saison de la série',
    example: 120,
  })
  numberOfSeasons: number;

  @ApiProperty({
    description: 'Le nombre d épisode de la série',
    example: 120,
  })
  numberOfEpisodes: number;

  @ApiProperty({
    description: 'L accroche du film ou de la série',
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
  })
  seasons: SeasonDetailsDto[];

  constructor(
    numberOfSeasons: number,
    numberOfEpisodes: number,
    seasons: SeasonDetailsDto[],
  ) {
    this.numberOfSeasons = numberOfSeasons;
    this.numberOfEpisodes = numberOfEpisodes;
    this.seasons = seasons;
  }
}

export class SeasonDetailsDto {
  @ApiProperty({
    description: 'Le nombre d épisode de la série',
    example: 120,
  })
  seasonNumber: number;

  @ApiProperty({
    description: 'L accroche du film ou de la série',
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
  })
  episodes: EpisodeDetails[];

  @ApiProperty({
    description: 'La date de sortie de la saison',
    example: '2023-10-01',
  })
  airDate: string;

  @ApiProperty({
    description: 'L accroche de la saison',
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
  })
  overview: string;

  @ApiProperty({
    description: 'L url de la saison',
    example:
      'https://www.themoviedb.org/t/p/original/8j0v1x1x1x1x1x1x1x1x1x1.jpg',
  })
  fileUrl: string;

  constructor(
    seasonNumber: number,
    episodes: EpisodeDetails[],
    airDate: string,
    overview: string,
    fileUrl: string,
  ) {
    this.seasonNumber = seasonNumber;
    this.episodes = episodes;
    this.airDate = airDate;
    this.overview = overview;
    this.fileUrl = fileUrl;
  }
}

export class EpisodeDetails {
  @ApiProperty({
    description: 'Le numéro de l épisode',
    example: 1,
  })
  number: number;

  @ApiProperty({
    description: 'Le titre de l épisode',
    example: 'Pilot',
  })
  title: string;

  @ApiProperty({
    description: 'L accroche de l épisode',
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
  })
  overview: string;

  @ApiProperty({
    description: 'La date de sortie de l épisode',
    example: '2023-10-01',
  })
  airDate: Date;

  @ApiProperty({
    description: 'La durée de l épisode',
    example: 60,
  })
  runtime: number;

  constructor(
    number: number,
    title: string,
    overview: string,
    airDate: Date,
    runtime: number,
  ) {
    this.number = number;
    this.title = title;
    this.overview = overview;
    this.airDate = airDate;
    this.runtime = runtime;
  }
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
  type: VideoType;

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

  @ApiProperty({
    description: 'Les détails de la série',
    type: SerieDetailsDto,
    nullable: true,
  })
  serieDetails: SerieDetailsDto | null;
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
    serieDetails: video.serieDetails
      ? mapFromSerieDetailsToSerieDetailsDto(video.serieDetails)
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

export const mapFromSerieDetailsToSerieDetailsDto = (
  serieDetails: SerieDetails,
): SerieDetailsDto => {
  return {
    numberOfSeasons: serieDetails.numberOfSeasons,
    numberOfEpisodes: serieDetails.numberOfEpisodes,
    seasons: serieDetails.seasons.map(
      (season) =>
        new SeasonDetailsDto(
          season.seasonNumber,
          season.episodes.map(
            (episode) =>
              new EpisodeDetails(
                episode.number,
                episode.title,
                episode.overview,
                episode.airDate,
                episode.runtime,
              ),
          ),
          season.airDate.toISOString(),
          season.overview,
          season.fileUrl,
        ),
    ),
  };
};
