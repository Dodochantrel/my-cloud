import { EpisodeDetails, SeasonDetails, SerieDetails } from '../class/video';

export interface SerieDetailsDto {
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: SeasonDetailsDto[];
}

export interface SeasonDetailsDto {
  seasonNumber: number;
  episodes: EpisodeDetailsDto[];
  airDate: Date;
  overview: string;
  fileUrl: string;
}

export interface EpisodeDetailsDto {
  number: number;
  title: string;
  overview: string;
  airDate: Date;
  runtime: number;
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
    episodes: dto.episodes.map((episode) =>
      mapFromEpisodeDetailsDtoToEpisodeDetails(episode)
    ),
    airDate: new Date(dto.airDate),
    overview: dto.overview,
    fileUrl: dto.fileUrl,
  };
};

export const mapFromEpisodeDetailsDtoToEpisodeDetails = (
  dto: EpisodeDetailsDto
): EpisodeDetails => {
  return {
    number: dto.number,
    title: dto.title,
    overview: dto.overview,
    airDate: new Date(dto.airDate),
    runtime: dto.runtime,
  };
};
