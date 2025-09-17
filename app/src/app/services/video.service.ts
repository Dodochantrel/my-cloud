import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, Injectable, linkedSignal, signal } from '@angular/core';
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
  EpisodeDetails,
  Video,
  VideoProvider,
  VideoType,
} from '../class/video';
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
import { EpisodeDto, mapFromEpisodeDetailsDtosToEpisodes } from '../dto/episode.dto';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private readonly httpClient: HttpClient) {
    effect(() => {
      // quand le type change, reset de la pagination
      if (this.type()) {
        this.search.set('');
        this.pageSeen.set(1);
        this.pageToWatch.set(1);
        this.limitSeen.set(20);
        this.limitToWatch.set(20);
      }
    });
  }

  //! Filtres globaux
  public search = signal<string>('');
  public type = signal<VideoType>('movie');

  //! --- LISTE GLOBALE ---
  private getMyResource = httpResource<VideoDto[]>(
    () =>
      `${environment.apiUrl}videos/${this.type()}s?search=${this.search()}&page=1&limit=20`
  );

  videos = linkedSignal(() => {
    const resource = this.getMyResource.value();
    return resource
      ? mapFromDtosToVideos(resource)
      : [];
  });
  public isLoading = computed(() => this.getMyResource.isLoading());

  refresh() {
    this.getMyResource.reload();
  }

  //! --- SEEN ---
  public pageSeen = signal(1);
  public limitSeen = signal(20);

  private getMySeen = httpResource<PaginatedDto<VideoDto>>(
    () =>
      `${environment.apiUrl}videos/my-seen?search=${this.search()}&page=${this.pageSeen()}&limit=${this.limitSeen()}&type=${this.type()}`
  );

  videosSeen = linkedSignal(() => {
    const resource = this.getMySeen.value();
    return resource
      ? mapFromDtosToVideos(resource.data)
      : [];
  });
  public itemCountSeen = computed(() => this.getMySeen.value()?.meta.itemCount ?? 0);
  public isLoadingSeen = computed(() => this.getMySeen.isLoading());

  //! --- TO WATCH ---
  public searchToWatch = signal<string>('');
  public pageToWatch = signal(1);
  public limitToWatch = signal(20);

  private getToWatch = httpResource<PaginatedDto<VideoDto>>(
    () =>
      `${environment.apiUrl}videos/my-to-watch?search=${this.search()}&page=${this.pageToWatch()}&limit=${this.limitToWatch()}&type=${this.type()}`
  );

  videosToWatch = linkedSignal(() => {
    const resource = this.getToWatch.value();
    return resource
      ? mapFromDtosToVideos(resource.data)
      : [];
  });
  public itemCountToWatch = computed(() => this.getToWatch.value()?.meta.itemCount ?? 0);
  public isLoadingToWatch = computed(() => this.getToWatch.isLoading());
  refreshToWatch() {
    this.getToWatch.reload();
  }

  //! --- ACTIONS ---

  edit(video: Video): Observable<Video> {
    return this.httpClient
      .patch<VideoDto>(
        `${environment.apiUrl}videos/${video.id}`,
        mapFromVideoToPatchVideoDto(video)
      )
      .pipe(map(mapFromDtoToVideo));
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
      .pipe(map(mapFromDtoToVideo));
  }  

  //! --- FETCH ONE ---

  getOneMovie(id: number): Observable<Video> {
    return this.httpClient
      .get<VideoDto>(`${environment.apiUrl}videos/movie/${id}`)
      .pipe(map(mapFromDtoToVideo));
  }

  getOneSerie(id: number): Observable<Video> {
    return this.httpClient
      .get<VideoDto>(`${environment.apiUrl}videos/serie/${id}`)
      .pipe(map(mapFromDtoToVideo));
  }

  getDirector(id: number, videoType: VideoType): Observable<Director> {
    return this.httpClient
      .get<VideoDirectorDto>(`${environment.apiUrl}videos/director/${id}?type=${videoType}`)
      .pipe(map(mapFromVideoDirectorDtoToVideoDirector));
  }

  getProviders(id: number, videoType: VideoType): Observable<VideoProvider[]> {
    return this.httpClient
      .get<VideoProviderDto[]>(`${environment.apiUrl}videos/providers/${id}?type=${videoType}`)
      .pipe(map(mapFromVideoProviderDtosToVideoProviders));
  }

  getSimilars(id: number, videoType: VideoType): Observable<Video[]> {
    return this.httpClient
      .get<VideoDto[]>(`${environment.apiUrl}videos/similars/${id}?type=${videoType}`)
      .pipe(map(mapFromDtosToVideos));
  }

  getCasting(id: number, videoType: VideoType): Observable<Casting[]> {
    return this.httpClient
      .get<VideoCastingDto[]>(`${environment.apiUrl}videos/casting/${id}?type=${videoType}`)
      .pipe(map(mapFromVideoCastingDtosToVideoCastings));
  }

  getEpisodes(serieId: number, id: number): Observable<EpisodeDetails[]> {
    return this.httpClient
      .get<EpisodeDto[]>(`${environment.apiUrl}videos/serie/${serieId}/episodes?season=${id}`)
      .pipe(map(mapFromEpisodeDetailsDtosToEpisodes));
  }
}
