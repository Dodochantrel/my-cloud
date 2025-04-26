import { Video } from '../class/video';

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
  genre: string;
  type: 'movie' | 'series';
}

export const mapFromDtoToVideo = (dto: VideoDto): Video => {
  return new Video(
    dto.id,
    dto.isFavorite,
    dto.isSeen,
    dto.isToWatch,
    dto.rating,
    dto.title,
    new Date(dto.releaseDate),
    dto.description,
    dto.fileUrl,
    dto.dateSeen,
    dto.genre,
    dto.type,
  );
};

export const mapFromDtosToVideos = (dtos: VideoDto[]): Video[] => {
  return dtos.map((dto) => mapFromDtoToVideo(dto));
};
