import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  mapFromDtosToVideos,
  mapFromDtoToVideo,
  mapFromVideoToPatchVideoDto,
  VideoDto,
} from '../dto/video.dto';
import { map, Observable } from 'rxjs';
import {
  Casting,
  Director,
  Video,
  VideoProvider,
  VideoType,
} from '../class/video';
import { Paginated } from '../class/paginated';
import { PaginatedDto } from '../dto/paginated-response.dto';
import {
  mapFromVideoDirectorDtoToVideoDirector,
  VideoDirectorDto,
} from '../dto/video-director.dto';
import {
  mapFromVideoProviderDtosToVideoProviders,
  VideoProviderDto,
} from '../dto/video-provider.dto';
import {
  mapFromVideoCastingDtosToVideoCastings,
  VideoCastingDto,
} from '../dto/video-casting.dto';

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

  getSeries(search: string = ''): Observable<Video[]> {
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

  edit(video: Video): Observable<Video> {
    return this.httpClient
      .patch<VideoDto>(
        `${environment.apiUrl}videos/${video.id}`,
        mapFromVideoToPatchVideoDto(video)
      )
      .pipe(map((response: VideoDto) => mapFromDtoToVideo(response)));
  }

  setSeen(video: Video, isSeen: boolean, dateSeen: Date, rating: number): Observable<Video> {
    video.isSeen = isSeen;
    video.dateSeen = dateSeen;
    video.rating = rating;
    return this.httpClient
      .patch<VideoDto>(
        `${environment.apiUrl}videos/${video.id}`,
        mapFromVideoToPatchVideoDto(video)
      )
      .pipe(map((response: VideoDto) => mapFromDtoToVideo(response)));
  }

  getOneMovie(id: number): Observable<Video> {
    return this.httpClient
      .get<VideoDto>(`${environment.apiUrl}videos/movie/${id}`)
      .pipe(map((response: VideoDto) => mapFromDtoToVideo(response)));
  }

  getOneSerie(id: number): Observable<Video> {
    return this.httpClient
      .get<VideoDto>(`${environment.apiUrl}videos/serie/${id}`)
      .pipe(map((response: VideoDto) => mapFromDtoToVideo(response)));
  }

  getDirector(id: number, videoType: VideoType): Observable<Director> {
    return this.httpClient
      .get<VideoDirectorDto>(`${environment.apiUrl}videos/director/${id}?type=${videoType}`)
      .pipe(
        map((response: VideoDirectorDto) =>
          mapFromVideoDirectorDtoToVideoDirector(response)
        )
      );
  }

  getProviders(id: number, videoType: VideoType): Observable<VideoProvider[]> {
    return this.httpClient
      .get<VideoProviderDto[]>(`${environment.apiUrl}videos/providers/${id}?type=${videoType}`)
      .pipe(
        map((response: VideoProviderDto[]) =>
          mapFromVideoProviderDtosToVideoProviders(response)
        )
      );
  }

  getSimilars(id: number, videoType: VideoType): Observable<Video[]> {
    return this.httpClient
      .get<VideoDto[]>(`${environment.apiUrl}videos/similars/${id}?type=${videoType}`)
      .pipe(map((response: VideoDto[]) => mapFromDtosToVideos(response)));
  }

  getCasting(id: number, videoType: VideoType): Observable<Casting[]> {
    return this.httpClient
      .get<VideoCastingDto[]>(`${environment.apiUrl}videos/casting/${id}?type=${videoType}`)
      .pipe(
        map((response: VideoCastingDto[]) =>
          mapFromVideoCastingDtosToVideoCastings(response)
        )
      );
  }
}
