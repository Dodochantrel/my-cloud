import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Video, VideoGenre } from '../video.entity';

@Injectable()
export class TmdbRepositoryRepository {
  constructor(private readonly httpService: HttpService) {}

  private readonly apiKey = process.env.TMDB_API_KEY;

  async getMovies(search: string): Promise<Video[]> {
    const genres = await this.getGenres(true);
    let movies: TmdbDataResultResponse[];
    if (search === '') {
      movies = await this.getMoviesWithSearch(search);
    } else {
      movies = await this.getMoviesNowPlaying();
    }
    return this.mapFromTmdbResponseToVideo(movies, genres);
  }

  private async getMoviesNowPlaying() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.apiKey}&language=fr-FR&page=1`;
    const response = await firstValueFrom(
      this.httpService.get<TmdbDataResponse>(url),
    );
    return response.data.results;
  }

  private async getMoviesWithSearch(
    search: string,
  ): Promise<TmdbDataResultResponse[]> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=fr-FR&query=${search}}&page=1&include_adult=false`;
    const response = await firstValueFrom(
      this.httpService.get<TmdbDataResponse>(url),
    );
    return response.data.results;
  }

  async getSeries(search: string): Promise<Video[]> {
    const genres = await this.getGenres(false);
    let series: TmdbDataResultResponse[];
    if (search === '') {
      series = await this.getSeriesWithSearch(search);
    } else {
      series = await this.getSeriesNowPlaying();
    }
    return this.mapFromTmdbResponseToVideo(series, genres);
  }

  private async getSeriesNowPlaying() {
    const url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${this.apiKey}&language=fr-FR&page=1`;
    const response = await firstValueFrom(
      this.httpService.get<TmdbDataResponse>(url),
    );
    return response.data.results;
  }

  private async getSeriesWithSearch(search: string) {
    const url = `https://api.themoviedb.org/3/search/tv?api_key=${this.apiKey}&language=fr-FR&query=${search}&page=1&include_adult=false`;
    const response = await firstValueFrom(
      this.httpService.get<TmdbDataResponse>(url),
    );
    return response.data.results;
  }

  private mapFromTmdbDataResultResponseToVideo(
    tmdbDataResponse: TmdbDataResultResponse,
    genres: TmdbGenre[],
  ): Video {
    return new Video({
      id: tmdbDataResponse.id,
      title: tmdbDataResponse.title,
      type: 'movie',
      releaseDate: tmdbDataResponse.release_date,
      description: tmdbDataResponse.overview,
      fileUrl: `https://image.tmdb.org/t/p/w500${tmdbDataResponse.poster_path}`,
      dateSeen: null,
      isSeen: false,
      isToWatch: false,
      isFavorite: false,
      rating: null,
      genre: this.getGenreName(tmdbDataResponse.genre_ids, genres),
    });
  }

  private mapFromTmdbResponseToVideo(
    tmdbResponse: TmdbDataResultResponse[],
    tmdbGenre: TmdbGenre[],
  ): Video[] {
    return tmdbResponse.map((tmdbDataResponse) =>
      this.mapFromTmdbDataResultResponseToVideo(tmdbDataResponse, tmdbGenre),
    );
  }

  private async getGenres(isMovie: boolean): Promise<TmdbGenre[]> {
    const type = isMovie ? 'movie' : 'tv';
    const url = `https://api.themoviedb.org/3/genre/${type}/list?api_key=${this.apiKey}&language=fr-FR`;
    const response = await firstValueFrom(
      this.httpService.get<TmdbGenreResponse>(url),
    );
    return response.data.genres;
  }

  private getGenreName(
    ids: number[],
    tmdbGenre: TmdbGenre[],
  ): VideoGenre | null {
    const genre = tmdbGenre.find((g) => ids.includes(g.id));
    return genre ? genre : null;
  }
}

export interface TmdbDataResponse {
  dates: { maximum: string; minimum: string };
  page: number;
  results: TmdbDataResultResponse[];
  total_pages: number;
  total_results: number;
}

export interface TmdbDataResultResponse {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TmdbGenreResponse {
  genres: TmdbGenre[];
}

export interface TmdbGenre {
  id: number;
  name: string;
}
