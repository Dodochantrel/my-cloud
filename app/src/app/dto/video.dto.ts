import { Video } from '../class/video';
import {
  mapFromMovieDetailsDtoToMovieDetails,
  MovieDetailsDto,
} from './movie-details.dto';
import { mapFromSerieDetailsDtoToSerieDetails, SerieDetailsDto } from './serie-details.dto';

export interface VideoDto {
  id: number;
  isFavorite: boolean;
  isSeen: boolean;
  isToWatch: boolean;
  rating: number;
  title: string;
  releaseDate: string;
  description: string;
  fileUrl: string;
  dateSeen: string;
  genre: string[];
  type: 'movie' | 'serie';
  movieDetails: MovieDetailsDto | null;
  similars: VideoDto[] | null;
  serieDetails: SerieDetailsDto | null;
}

export interface PatchVideoDto {
  isFavorite: boolean;
  isSeen: boolean;
  isToWatch: boolean;
  rating: number | null;
  dateSeen: string | null;
}

export const mapFromDtoToVideo = (dto: VideoDto): Video => {
  const video = new Video(
    dto.id,
    dto.isFavorite,
    dto.isSeen,
    dto.isToWatch,
    dto.rating,
    dto.title,
    new Date(dto.releaseDate),
    dto.description,
    dto.fileUrl,
    dto.dateSeen ? new Date(dto.dateSeen) : null,
    dto.genre,
    dto.type
  );
  video.movieDetails = dto.movieDetails
    ? mapFromMovieDetailsDtoToMovieDetails(dto.movieDetails)
    : null;
  video.serieDetails = dto.serieDetails
    ? mapFromSerieDetailsDtoToSerieDetails(dto.serieDetails)
    : null;
  video.similars = dto.similars ? mapFromDtosToVideos(dto.similars) : null;
  return video;
};

export const mapFromDtosToVideos = (dtos: VideoDto[]): Video[] => {
  return dtos.map((dto) => mapFromDtoToVideo(dto));
};

export const mapFromVideoToPatchVideoDto = (video: Video): PatchVideoDto => {
  return {
    isFavorite: video.isFavorite,
    isSeen: video.isSeen,
    isToWatch: video.isToWatch,
    rating: video.rating,
    dateSeen: video.dateSeen ? video.dateSeen.toISOString() : null,
  };
};
