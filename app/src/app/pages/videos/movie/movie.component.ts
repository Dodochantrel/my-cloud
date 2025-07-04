import { Component, OnInit } from '@angular/core';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { Video } from '../../../class/video';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CurrentVideosComponent } from '../../../components/videos/current-videos/current-videos.component';
import { WatchVideosComponent } from '../../../components/videos/watch-videos/watch-videos.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie',
  imports: [
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AutoCompleteModule,
    ButtonModule,
    CurrentVideosComponent,
    WatchVideosComponent,
    FormsModule,
  ],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent implements OnInit {
  constructor(
    private readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {}

  public isLoadingSearch: boolean = false;
  public search: string = '';

  public moviesToSearch: Video[] = [];

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
    }
  }

  onMovieSelect(event: any) {
    this.router.navigate([`videos/details/movie/${event.value.id}`]);
  }

  searchMovies() {
    this.isLoadingSearch = true;
    this.videoService.getMovies(this.search).subscribe({
      next: (response) => {
        this.moviesToSearch = response;
      },
      error: (error) => {
        this.notificationService.showError(
          'Error lors du chargement des films',
          error.message
        );
      },
      complete: () => {
        this.isLoadingSearch = false;
      },
    });
  }
}
