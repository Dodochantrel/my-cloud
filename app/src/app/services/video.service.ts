import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  mapFromDtosToVideos,
  mapFromDtoToVideo,
  VideoDto,
} from '../dto/video.dto';
import { map, Observable } from 'rxjs';
import { Video, VideoType } from '../class/video';
import { Paginated } from '../class/paginated';
import { PaginatedDto } from '../dto/paginated-response.dto';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private readonly httpClient: HttpClient) {}

  getMovies(search: string = ''): Observable<Video[]> {
    return this.httpClient
      .get<VideoDto[]>(`${environment.apiUrl}videos/movies?search=${search}`)
      .pipe(map((response: VideoDto[]) => mapFromDtosToVideos(response)));
  }

  getSeries(search: string): Observable<Video[]> {
    return this.httpClient
      .get<VideoDto[]>(`${environment.apiUrl}videos/series?search=${search}`)
      .pipe(map((response: VideoDto[]) => mapFromDtosToVideos(response)));
  }

  getMyMoviesSeen(
    page: number,
    limit: number,
    type: VideoType,
    search: string = ''
  ): Observable<Paginated<Video>> {
    return this.httpClient
      .get<PaginatedDto<VideoDto>>(
        `${environment.apiUrl}videos/my-watch?search=${search}&page=${page}&limit=${limit}&type=${type}`
      )
      .pipe(
        map((response: PaginatedDto<VideoDto>) => {
          return new Paginated<Video>(
            mapFromDtosToVideos(response.data),
            response.meta
          );
        })
      );
  }

  addSeen(id: number): Observable<Video> {
    return this.httpClient
      .patch<VideoDto>(`${environment.apiUrl}videos/add-to-seen/${id}`, {})
      .pipe(
        map((response: VideoDto) => {
          return mapFromDtoToVideo(response);
        })
      );
  }

  removeSeen(id: number): Observable<Video> {
    return this.httpClient
      .patch<VideoDto>(`${environment.apiUrl}videos/remove-from-seen/${id}`, {})
      .pipe(
        map((response: VideoDto) => {
          return mapFromDtoToVideo(response);
        })
      );
  }

  addWatch(id: number): Observable<Video> {
    return this.httpClient
      .patch<VideoDto>(`${environment.apiUrl}videos/add-to-watch/${id}`, {})
      .pipe(
        map((response: VideoDto) => {
          return mapFromDtoToVideo(response);
        })
      );
  }

  removeWatch(id: number): Observable<Video> {
    return this.httpClient
      .patch<VideoDto>(
        `${environment.apiUrl}videos/remove-from-watch/${id}`,
        {}
      )
      .pipe(
        map((response: VideoDto) => {
          return mapFromDtoToVideo(response);
        })
      );
  }

  addFavorite(id: number): Observable<Video> {
    return this.httpClient
      .patch<VideoDto>(`${environment.apiUrl}videos/add-to-favorite/${id}`, {})
      .pipe(
        map((response: VideoDto) => {
          return mapFromDtoToVideo(response);
        })
      );
  }

  removeFavorite(id: number): Observable<Video> {
    return this.httpClient
      .patch<VideoDto>(
        `${environment.apiUrl}videos/remove-from-favorite/${id}`,
        {}
      )
      .pipe(
        map((response: VideoDto) => {
          return mapFromDtoToVideo(response);
        })
      );
  }
}
