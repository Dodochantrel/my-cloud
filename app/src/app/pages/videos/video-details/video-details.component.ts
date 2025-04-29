import { Component, OnInit } from '@angular/core';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { defaultVideo, Video, VideoType } from '../../../class/video';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AddVideoSeenComponent } from '../../../components/videos/add-video-seen/add-video-seen.component';
import { setImageUrl } from '../../../tools/set-image-url';
import { Observable } from 'rxjs';
import { VideoSeasonComponent } from '../../../components/video/video-season/video-season.component';

@Component({
  selector: 'app-video-details',
  imports: [
    TagModule,
    CommonModule,
    ButtonModule,
    AddVideoSeenComponent,
    VideoSeasonComponent,
  ],
  templateUrl: './video-details.component.html',
  styleUrl: './video-details.component.css',
})
export class VideoDetailsComponent implements OnInit {
  constructor(
    private readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getData(this.getUrlCustomerId());
    }
  }

  setImageUrl(url: string | null | undefined): string {
    return setImageUrl(url);
  }

  goToDetails(id: number) {
    this.router.navigate([`videos/details/${id}`]);
    this.getData(id);
  }

  getData(id: number) {
    this.getVideo(id);
  }

  getUrlCustomerId(): number {
    return Number(this.route.snapshot.paramMap.get('id')); // Convertit l'ID en nombre
  }

  getUrlType(): VideoType {
    return this.route.snapshot.paramMap.get('type') as VideoType; // Récupère le type de vidéo depuis l'URL
  }

  public isLoadingDetails: boolean = false;
  public isLoadingCasting: boolean = false;
  public isLoadingProviders: boolean = false;
  public isLoadingSimilars: boolean = false;

  public isLoadingHandleToWatchlist: boolean = false;
  public isLoadingHandleToFavorite: boolean = false;

  public isModalSeenVisible: boolean = false;

  public video: Video = defaultVideo;

  getVideoDetails(type: VideoType, id: number): Observable<Video> {
    console.log('getVideoDetails', type, id);
    if (type === 'movie') {
      return this.videoService.getOneMovie(id);
    } else if (type === 'serie') {
      return this.videoService.getOneSerie(id);
    } else {
      throw new Error('Invalid video type');
    }
  }

  getVideo(videoId: number) {
    this.isLoadingDetails = true;
    this.getVideoDetails(this.getUrlType(), videoId).subscribe({
      next: (response) => {
        this.video = response;
        if (this.video.type === 'movie') {
          this.getDirector(videoId);
        }
        this.getCasting(videoId);
        this.getProviders(videoId);
      },
      error: (error) => {
        this.notificationService.showError(
          'Error fetching video details',
          error.message
        );
      },
      complete: () => {
        this.isLoadingDetails = false;
      },
    });
  }

  getCasting(videoId: number) {
    this.isLoadingCasting = true;
    this.videoService.getCasting(videoId, this.video.type).subscribe({
      next: (response) => {
        this.video.casting = response;
      },
      error: (error) => {
        this.notificationService.showError(
          'Error fetching video casting',
          error.message
        );
      },
      complete: () => {
        this.isLoadingCasting = false;
      },
    });
  }

  getProviders(videoId: number) {
    this.isLoadingProviders = true;
    this.videoService.getProviders(videoId, this.video.type).subscribe({
      next: (response) => {
        this.video.providers = response;
        this.getSimilars(videoId);
      },
      error: (error) => {
        this.notificationService.showError(
          'Error fetching video providers',
          error.message
        );
      },
      complete: () => {
        this.isLoadingProviders = false;
      },
    });
  }

  getSimilars(videoId: number) {
    this.isLoadingSimilars = true;
    this.videoService.getSimilars(videoId, this.video.type).subscribe({
      next: (response) => {
        this.video.similars = response;
      },
      error: (error) => {
        this.notificationService.showError(
          'Error fetching video similars',
          error.message
        );
      },
      complete: () => {
        this.isLoadingSimilars = false;
      },
    });
  }

  getDirector(videoId: number) {
    this.isLoadingDetails = true;
    this.videoService.getDirector(videoId, this.video.type).subscribe({
      next: (response) => {
        this.video.director = response;
      },
      error: (error) => {
        this.notificationService.showError(
          'Error fetching video director',
          error.message
        );
      },
      complete: () => {
        this.isLoadingDetails = false;
      },
    });
  }

  handleToWatchlist(video: Video) {
    this.isLoadingHandleToWatchlist = true;
    video.isToWatch = !video.isToWatch;
    this.videoService.edit(video).subscribe({
      next: () => {
        this.video.isToWatch = video.isToWatch;
        this.notificationService.showSuccess(
          'Ajouté',
          `${video.title} a été ajouté à votre liste à voir`
        );
      },
      error: (error) => {
        this.notificationService.showError(
          "Erreur lors de l'ajout à la liste à voir",
          error.message
        );
      },
      complete: () => {
        this.isLoadingHandleToWatchlist = false;
      },
    });
  }

  handleToFavorite(video: Video) {
    this.isLoadingHandleToFavorite = true;
    video.isFavorite = !video.isFavorite;
    this.videoService.edit(video).subscribe({
      next: () => {
        this.video.isFavorite = video.isFavorite;
        this.notificationService.showSuccess(
          'Ajouté',
          `${video.title} a été ajouté à votre liste de favoris`
        );
      },
      error: (error) => {
        this.notificationService.showError(
          "Erreur lors de l'ajout à la liste de favoris",
          error.message
        );
      },
      complete: () => {
        this.isLoadingHandleToFavorite = false;
      },
    });
  }

  setSeen(video: Video) {
    this.video.isSeen = video.isSeen;
    this.video.dateSeen = video.dateSeen;
    this.video.rating = video.rating;
  }
}
