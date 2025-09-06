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
import { EpisodeDto, mapFromEpisodeDetailsDtosToEpisodes } from '../dto/episode.dto';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private readonly httpClient: HttpClient) {
    effect(() => {
      // SI type change alors on reset la page a 1 et search a vide
      if (this.type()) {
        this.search.set('');
        this.pageSeen.set(1);
        this.pageToWatch.set(1);
        this.limitSeen.set(20);
        this.limitToWatch.set(20);
      }
    });
  }

  public search = signal<string>('');
  public type = signal<VideoType>('movie');

  private getMyResource = httpResource<VideoDto[]>(
    () => `${environment.apiUrl}videos/${this.type()}s?search=${this.search()}&page=1&limit=20`
  );  

  public videos = computed(() => this.getMyResource.value() ? mapFromDtosToVideos(this.getMyResource.value()!) : []);
  public isLoading = computed(() => this.getMyResource.isLoading());

  //! Seen

  public pageSeen = signal(1);
  public limitSeen = signal(20);

  private getMySeen = httpResource<PaginatedDto<VideoDto>>(
    () => `${environment.apiUrl}videos/my-seen?search=${this.search()}&page=${this.pageSeen()}&limit=${this.limitSeen()}&type=${this.type()}`
  );  

  public videosSeen = computed(() => this.getMySeen.value() ? mapFromDtosToVideos(this.getMySeen.value()!.data) : []);
  public itemCountSeen = computed(() => this.getMySeen.value() ? this.getMySeen.value()!.meta.itemCount : 0);
  public isLoadingSeen = computed(() => this.getMySeen.isLoading());

  //! To Watch

  public pageToWatch = signal(1);
  public limitToWatch = signal(20);

  private getToWatch = httpResource<PaginatedDto<VideoDto>>(
    () => `${environment.apiUrl}videos/my-to-watch?search=${this.search()}&page=${this.pageSeen()}&limit=${this.limitSeen()}&type=${this.type()}`
  );  

  public videosToWatch = computed(() => this.getToWatch.value() ? mapFromDtosToVideos(this.getToWatch.value()!.data) : []);
  public itemCountToWatch = computed(() => this.getToWatch.value() ? this.getToWatch.value()!.meta.itemCount : 0);
  public isLoadingToWatch = computed(() => this.getToWatch.isLoading());

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

  getEpisodes(serieId: number, id: number): Observable<EpisodeDetails[]> {
    return this.httpClient
      .get<EpisodeDto[]>(`${environment.apiUrl}videos/serie/${serieId}/episodes?season=${id}`)
      .pipe(
        map((response: EpisodeDetails[]) => mapFromEpisodeDetailsDtosToEpisodes(response))
      );
  }
}
