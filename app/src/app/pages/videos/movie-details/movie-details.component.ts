import { Component, OnInit } from '@angular/core';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { defaultVideo, Video } from '../../../class/video';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AddVideoSeenComponent } from '../../../components/videos/add-video-seen/add-video-seen.component';
import { setImageUrl } from '../../../tools/set-image-url';

@Component({
  selector: 'app-movie-details',
  imports: [TagModule, CommonModule, ButtonModule, AddVideoSeenComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
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
    this.getVideoDetails(id);
  }

  getUrlCustomerId(): number {
    return Number(this.route.snapshot.paramMap.get('id')); // Convertit l'ID en nombre
  }

  public isLoadingDetails: boolean = false;
  public isLoadingCasting: boolean = false;
  public isLoadingProviders: boolean = false;
  public isLoadingSimilars: boolean = false;

  public isLoadingHandleToWatchlist: boolean = false;
  public isLoadingHandleToFavorite: boolean = false;

  public isModalSeenVisible: boolean = false;

  public movie: Video = defaultVideo;

  getVideoDetails(videoId: number) {
    this.isLoadingDetails = true;
    this.videoService.getOneMovie(videoId).subscribe({
      next: (response) => {
        this.movie = response;
        this.getDirector(videoId);
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
    this.videoService.getCasting(videoId).subscribe({
      next: (response) => {
        this.movie.casting = response;
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
    this.videoService.getProviders(videoId).subscribe({
      next: (response) => {
        this.movie.providers = response;
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
    this.videoService.getSimilars(videoId).subscribe({
      next: (response) => {
        this.movie.similars = response;
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
    this.videoService.getDirector(videoId).subscribe({
      next: (response) => {
        this.movie.director = response;
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
        this.movie.isToWatch = video.isToWatch;
        this.notificationService.showSuccess(
          'Ajouté',
          `${video.title} a été ajouté à votre liste de films à voir`
        );
      },
      error: (error) => {
        this.notificationService.showError(
          "Erreur lors de l'ajout à la liste de films à voir",
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
        this.movie.isFavorite = video.isFavorite;
        this.notificationService.showSuccess(
          'Ajouté',
          `${video.title} a été ajouté à votre liste de films favoris`
        );
      },
      error: (error) => {
        this.notificationService.showError(
          "Erreur lors de l'ajout à la liste de films favoris",
          error.message
        );
      },
      complete: () => {
        this.isLoadingHandleToFavorite = false;
      },
    });
  }

  setSeen(video: Video) {
    this.movie.isSeen = video.isSeen;
    this.movie.dateSeen = video.dateSeen;
    this.movie.rating = video.rating;
  }
}
