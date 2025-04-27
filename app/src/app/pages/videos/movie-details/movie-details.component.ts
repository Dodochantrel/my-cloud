import { Component, OnInit } from '@angular/core';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { Video } from '../../../class/video';
import { ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  imports: [TagModule, CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  constructor(
    private readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getData(this.getUrlCustomerId());
    }
  }

  getData(id: number) {
    this.getVideoDetails(id);
    this.getCasting(id);
    this.getProviders(id);
    this.getSimilars(id);
    this.getDirector(id);
  }

  getUrlCustomerId(): number {
    return Number(this.route.snapshot.paramMap.get('id')); // Convertit l'ID en nombre
  }

  public isLoadingDetails: boolean = false;
  public isLoadingCasting: boolean = false;
  public isLoadingProviders: boolean = false;
  public isLoadingSimilars: boolean = false;
  public movie: Video = new Video(0, false, false, false, 0, '', new Date(), '', '', '', [], 'movie');

  getVideoDetails(videoId: number) {
    this.isLoadingDetails = true;
    this.videoService.getOneMovie(videoId).subscribe({
      next: (response) => {
        this.movie = response;
      },
      error: (error) => {
        this.notificationService.showError(
          'Error fetching video details',
          error.message
        );
      },
      complete: () => {
        this.isLoadingDetails = false;
      }
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
      }
    });
  }

  getProviders(videoId: number) {
    this.isLoadingProviders = true;
    this.videoService.getProviders(videoId).subscribe({
      next: (response) => {
        this.movie.providers = response;
      },
      error: (error) => {
        this.notificationService.showError(
          'Error fetching video providers',
          error.message
        );
      },
      complete: () => {
        this.isLoadingProviders = false;
      }
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
      }
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
      }
    });
  }
}
