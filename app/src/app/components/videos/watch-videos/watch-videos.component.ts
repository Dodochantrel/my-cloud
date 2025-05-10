import { Component, Input, OnInit } from '@angular/core';
import { getTypeToDisplay, Video, VideoType } from '../../../class/video';
import { Paginated } from '../../../class/paginated';
import { defaultPaginatedMeta } from '../../../class/paginated-meta';
import { NotificationService } from '../../../services/notification.service';
import { BrowserService } from '../../../services/browser.service';
import { VideoService } from '../../../services/video.service';
import { FooterTableComponent } from '../../footer-table/footer-table.component';
import { setImageUrl } from '../../../tools/set-image-url';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-watch-videos',
  imports: [FooterTableComponent, RatingModule, FormsModule, CommonModule],
  templateUrl: './watch-videos.component.html',
  styleUrl: './watch-videos.component.css',
})
export class WatchVideosComponent implements OnInit {
  constructor(
    private readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
        private readonly router: Router

  ) {}

  @Input() public type: VideoType = 'movie';

  public watchMoviesWithPagination: Paginated<Video> = new Paginated<Video>(
    [],
    defaultPaginatedMeta
  );

  public isLoadingWatchMovies: boolean = false;

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getWatchMovies(
        this.watchMoviesWithPagination.paginatedMeta.page,
        this.watchMoviesWithPagination.paginatedMeta.limit
      );
    }
  }

  setImageUrl(url: string | null | undefined): string {
    return setImageUrl(url);
  }

  getTypeToDisplay(
    type: VideoType,
    isFirstUpper: boolean,
    isPlural: boolean
  ): string {
    return getTypeToDisplay(type, isFirstUpper, isPlural);
  }

  getWatchMovies(page: number, limit: number) {
    this.isLoadingWatchMovies = true;
    this.videoService.getMyMoviesSeen(page, limit, 'movie', '').subscribe({
      next: (response) => {
        this.watchMoviesWithPagination = response;
      },
      error: (error) => {
        this.notificationService.showError(
          'Error lors du chargement des films',
          error.message
        );
      },
      complete: () => {
        this.isLoadingWatchMovies = false;
      },
    });
  }

  goToDetails(id: number) {
    this.router.navigate([`videos/details/${this.type}/${id}`]);
  }
}
