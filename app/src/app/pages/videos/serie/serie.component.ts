import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CurrentVideosComponent } from '../../../components/videos/current-videos/current-videos.component';
import { WatchVideosComponent } from '../../../components/videos/watch-videos/watch-videos.component';
import { FormsModule } from '@angular/forms';
import { Video } from '../../../class/video';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-serie',
  imports: [
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AutoCompleteModule,
    CurrentVideosComponent,
    WatchVideosComponent,
    FormsModule,
  ],
  templateUrl: './serie.component.html',
  styleUrl: './serie.component.css',
})
export class SerieComponent {
  constructor(
    private readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  public seriesToSearch: Video[] = [];
  public isLoadingSearch: boolean = false;
  public search: string = '';

  onMovieSelect(event: any) {
    this.router.navigate([`videos/details/serie/${event.value.id}`]);
  }

  searchSeries() {
    this.isLoadingSearch = true;
    this.videoService.getSeries(this.search).subscribe({
      next: (response) => {
        this.seriesToSearch = response;
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
