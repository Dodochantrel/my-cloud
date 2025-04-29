export interface SerieDetails {
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: SeasonDetails[];
}

export interface SeasonDetails {
  seasonNumber: number;
  episodes: EpisodeDetails[];
  airDate: Date;
  overview: string;
  fileUrl: string;
}

export interface EpisodeDetails {
  number: number;
  title: string;
  overview: string;
  airDate: Date;
  runtime: number;
}
