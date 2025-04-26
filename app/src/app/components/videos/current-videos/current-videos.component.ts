import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { Video } from '../../../class/video';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-videos',
  imports: [CarouselModule, ButtonModule],
  templateUrl: './current-videos.component.html',
  styleUrl: './current-videos.component.css',
})
export class CurrentVideosComponent implements OnInit {
  constructor(
    private readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  public nowPlayingMovies: Video[] = [];
  public isLoadingData: boolean = false;

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getMovies();
    }
  }

  goToDetails(id: number) {
    this.router.navigate([`videos/details/${id}`]);
  }

  getMovies() {
    this.isLoadingData = true;
    this.videoService.getMovies().subscribe({
      next: (response) => {
        this.nowPlayingMovies = response;
      },
      error: (error) => {
        this.notificationService.showError(
          'Error lors du chargement des films',
          error.message
        );
      },
      complete: () => {
        this.isLoadingData = false;
      },
    });
  }
}
