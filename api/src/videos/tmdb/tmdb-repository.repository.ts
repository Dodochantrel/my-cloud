import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Video, VideoType } from '../video.entity';
import { Casting } from '../interfaces/casting.interface';
import { Director } from '../interfaces/director.interface';
import { VideoProvider } from '../interfaces/provider.interface';
import { MovieDetails } from '../interfaces/movie-details.interface';

@Injectable()
export class TmdbRepositoryRepository {
  constructor(private readonly httpService: HttpService) {}

  private readonly apiKey = process.env.TMDB_API_KEY;

  async getCasting(id: number): Promise<Casting[]> {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.apiKey}&language=fr-FR`;
    const response = await firstValueFrom(this.httpService.get(url));
    return this.mapFromTmdbCastingsResponseToCastings(response.data.cast);
  }

  async getDirector(id: number): Promise<Director> {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.apiKey}&language=fr-FR`;
    const response = await firstValueFrom(this.httpService.get(url));
    const crew = response.data.crew;
    const director = crew.find((member) => member.job === 'Director');
    return this.mapFromTmdbDirectorResponseToDirector(director);
  }

  async getProviders(id: number): Promise<VideoProvider[]> {
    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${this.apiKey}&language=fr-FR`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data.results.FR?.flatrate
      ? this.mapFromTmdbProviderResponseToVideoProviders(
          response.data.results.FR?.flatrate.filter(
            (provider) => provider.display_priority <= 20,
          ),
        )
      : [];
  }

  async getSimilar(id: number): Promise<Video[]> {
    const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${this.apiKey}&language=fr-FR&page=1`;
    const [response, genres] = await Promise.all([
      firstValueFrom(this.httpService.get(url)),
      this.getGenres(true),
    ]);

    return this.mapFromTmdbResponseToVideo(
      response.data.results,
      genres,
      'movie',
    );
  }

  async getMovies(search: string): Promise<Video[]> {
    const genres = await this.getGenres(true);
    let movies: TmdbDataResultResponse[];
    if (search === '' || search === undefined) {
      movies = await this.getMoviesNowPlaying();
    } else {
      movies = await this.getMoviesWithSearch(search);
    }
    return this.mapFromTmdbResponseToVideo(movies, genres, 'movie');
  }

  async getMovie(id: number): Promise<Video> {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}&language=fr-FR`;

    const response = await firstValueFrom(this.httpService.get(url));
    return this.mapFromTmdbMovieDetailsResponseToVideo(response.data, 'movie');
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
    if (search === '' || search === undefined) {
      series = await this.getSeriesNowPlaying();
    } else {
      series = await this.getSeriesWithSearch(search);
    }
    return this.mapFromTmdbResponseToVideo(series, genres, 'series');
  }

  async getSerie(id: number): Promise<Video> {
    const genres = await this.getGenres(false);
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${this.apiKey}&language=fr-FR`;

    const response = await firstValueFrom(
      this.httpService.get<TmdbDataResultResponse>(url),
    );
    return this.mapFromTmdbDataResultResponseToVideo(
      response.data,
      genres,
      'series',
    );
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
    type: VideoType,
  ): Video {
    return new Video({
      tmdbId: tmdbDataResponse.id,
      title: tmdbDataResponse.title,
      releaseDate: tmdbDataResponse.release_date,
      description: tmdbDataResponse.overview,
      fileUrl: `https://image.tmdb.org/t/p/w400${tmdbDataResponse.poster_path}`,
      dateSeen: null,
      isSeen: false,
      isToWatch: false,
      isFavorite: false,
      rating: null,
      type: type,
      genre: this.getGenreName(tmdbDataResponse.genre_ids, genres),
    });
  }

  private mapFromTmdbResponseToVideo(
    tmdbResponse: TmdbDataResultResponse[],
    tmdbGenre: TmdbGenre[],
    type: VideoType,
  ): Video[] {
    return tmdbResponse.map((tmdbDataResponse) =>
      this.mapFromTmdbDataResultResponseToVideo(
        tmdbDataResponse,
        tmdbGenre,
        type,
      ),
    );
  }

  private mapFromTmdbCastingsResponseToCastings(
    castings: TmdbCastingResponse[],
  ): Casting[] {
    return castings.map((casting) => {
      return {
        id: casting.id,
        name: casting.name,
        popularity: casting.popularity,
        character: casting.character,
        order: casting.order,
        fileUrl: `https://image.tmdb.org/t/p/w300${casting.profile_path}`,
      };
    });
  }

  private async getGenres(isMovie: boolean): Promise<TmdbGenre[]> {
    const type = isMovie ? 'movie' : 'tv';
    const url = `https://api.themoviedb.org/3/genre/${type}/list?api_key=${this.apiKey}&language=fr-FR`;
    const response = await firstValueFrom(
      this.httpService.get<TmdbGenreResponse>(url),
    );
    return response.data.genres;
  }

  private getGenreName(ids: number[], tmdbGenre: TmdbGenre[]): string[] | null {
    const genre = tmdbGenre.find((g) => ids.includes(g.id));
    return genre ? [genre.name] : [];
  }

  private mapFromTmdbMovieDetailsResponseToVideo(
    tmdbMovieDetailsResponse: TmdbMovieDetailsResponse,
    type: VideoType,
  ): Video {
    return new Video({
      tmdbId: tmdbMovieDetailsResponse.id,
      title: tmdbMovieDetailsResponse.title,
      releaseDate: tmdbMovieDetailsResponse.release_date,
      description: tmdbMovieDetailsResponse.overview,
      fileUrl: `https://image.tmdb.org/t/p/w400${tmdbMovieDetailsResponse.poster_path}`,
      type: type,
      genre: tmdbMovieDetailsResponse.genres.map((g) => g.name),
      movieDetails:
        type === 'movie'
          ? this.mapFromTmdbMovieDetailsResponseToMovieDetails(
              tmdbMovieDetailsResponse,
            )
          : null,
    });
  }

  private mapFromTmdbMovieDetailsResponseToMovieDetails(
    tmdbMovieDetailsResponse: TmdbMovieDetailsResponse,
  ): MovieDetails {
    return {
      duration: tmdbMovieDetailsResponse.runtime,
      originalTitle: tmdbMovieDetailsResponse.original_title,
      tagline: tmdbMovieDetailsResponse.tagline,
    };
  }

  private mapFromTmdbDirectorResponseToDirector(
    tmdbDirectorResponse: TmdbDirectorResponse,
  ): Director {
    return {
      id: tmdbDirectorResponse.id,
      name: tmdbDirectorResponse.name,
      fileUrl: `https://image.tmdb.org/t/p/w300${tmdbDirectorResponse.profile_path}`,
    };
  }

  private mapFromTmdbProviderResponseToVideoProvider(
    tmdbProviderResponse: TmdbProviderResponse,
  ): VideoProvider {
    return {
      id: tmdbProviderResponse.provider_id,
      fileUrl: `https://image.tmdb.org/t/p/w300${tmdbProviderResponse.logo_path}`,
      name: tmdbProviderResponse.provider_name,
    };
  }

  private mapFromTmdbProviderResponseToVideoProviders(
    tmdbProviderResponse: TmdbProviderResponse[],
  ): VideoProvider[] {
    return tmdbProviderResponse.map((provider) =>
      this.mapFromTmdbProviderResponseToVideoProvider(provider),
    );
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

export interface TmdbCastingResponse {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface TmdbDirectorResponse {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface TmdbProviderResponse {
  logo_path: string;
  provider_id: 8;
  provider_name: string;
  display_priority: number;
}

export interface TmdbMovieDetailsResponse {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
