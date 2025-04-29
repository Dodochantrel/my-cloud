import { EpisodeDetails } from "../class/video";

export interface EpisodeDto {
  id: number;
  number: number;
  name: string;
  description: string;
  airDate: Date;
  duration: number;
  fileUrl: string;
}

export const mapFromEpisodeDetailsDtoToEpisode = (
  dto: EpisodeDto
): EpisodeDetails => {
  return {
    id: 0, 
    number: dto.number,
    name: dto.name,
    description: dto.description,
    airDate: new Date(dto.airDate),
    duration: dto.duration,
    fileUrl: dto.fileUrl,
  };
};

export const mapFromEpisodeDetailsDtosToEpisodes = (
  dtos: EpisodeDto[]
): EpisodeDetails[] => {
  return dtos.map((dto) => mapFromEpisodeDetailsDtoToEpisode(dto));
}
