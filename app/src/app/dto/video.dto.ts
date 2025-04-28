import { Video } from '../class/video';
import { mapFromMovieDetailsDtoToMovieDetails, MovieDetailsDto } from './movie-details.dto';

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
  type: 'movie' | 'series';
  movieDetails: MovieDetailsDto | null;
  similars: VideoDto[] | null;
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
  video.movieDetails = dto.movieDetails ? mapFromMovieDetailsDtoToMovieDetails(dto.movieDetails) : null;
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
