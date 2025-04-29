import { EpisodeDetails, SeasonDetails, SerieDetails } from '../class/video';
import { EpisodeDto, mapFromEpisodeDetailsDtosToEpisodes } from './episode.dto';

export interface SerieDetailsDto {
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: SeasonDetailsDto[];
}

export interface SeasonDetailsDto {
  seasonNumber: number;
  episodes: EpisodeDto[];
  airDate: Date;
  overview: string;
  fileUrl: string;
}

export const mapFromSerieDetailsDtoToSerieDetails = (
  dto: SerieDetailsDto
): SerieDetails => {
  return {
    numberOfSeasons: dto.numberOfSeasons,
    numberOfEpisodes: dto.numberOfEpisodes,
    seasons: dto.seasons.map((season) =>
      mapFromSeasonDetailsDtoToSeasonDetails(season)
    ),
  };
};

export const mapFromSeasonDetailsDtoToSeasonDetails = (
  dto: SeasonDetailsDto
): SeasonDetails => {
  return {
    seasonNumber: dto.seasonNumber,
    episodes: mapFromEpisodeDetailsDtosToEpisodes(dto.episodes),
    airDate: new Date(dto.airDate),
    description: dto.overview,
    fileUrl: dto.fileUrl,
  };
};
