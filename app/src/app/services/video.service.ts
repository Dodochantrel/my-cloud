import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
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

      const resource = this.getMyResource.value();
      if (resource) {
        this._videos.set(mapFromDtosToVideos(resource));
      }

      const seenResource = this.getMySeen.value();
      if (seenResource) {
        this._videosSeen.set(mapFromDtosToVideos(seenResource.data));
      }

      const toWatchResource = this.getToWatch.value();
      if (toWatchResource) {
        this._videosToWatch.set(mapFromDtosToVideos(toWatchResource.data));
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

  private readonly _videos = signal<Video[]>([]);
  public videos = computed(() => this._videos());
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

  private readonly _videosSeen = signal<Video[]>([]);
  public videosSeen = computed(() => this._videosSeen());
  public itemCountSeen = computed(() => this.getMySeen.value()?.meta.itemCount ?? 0);
  public isLoadingSeen = computed(() => this.getMySeen.isLoading());

  refreshSeen() {
    this.getMySeen.reload();
  }

  //! --- TO WATCH ---
  public pageToWatch = signal(1);
  public limitToWatch = signal(20);

  private getToWatch = httpResource<PaginatedDto<VideoDto>>(
    () =>
      `${environment.apiUrl}videos/my-to-watch?search=${this.search()}&page=${this.pageToWatch()}&limit=${this.limitToWatch()}&type=${this.type()}`
  );

  private readonly _videosToWatch = signal<Video[]>([]);
  public videosToWatch = computed(() => this._videosToWatch());
  public itemCountToWatch = computed(() => this.getToWatch.value()?.meta.itemCount ?? 0);
  public isLoadingToWatch = computed(() => this.getToWatch.isLoading());

  constructorToWatchSync() {
    effect(() => {
      const data = this.getToWatch.value();
      if (data) {
        this._videosToWatch.set(mapFromDtosToVideos(data.data));
      }
    });
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
