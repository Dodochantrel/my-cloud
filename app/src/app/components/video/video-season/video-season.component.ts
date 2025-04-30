import { Component, Input } from '@angular/core';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { defaultVideo, SeasonDetails, Video } from '../../../class/video';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { setImageUrl } from '../../../tools/set-image-url';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-video-season',
  imports: [CommonModule, AccordionModule, SkeletonModule],
  templateUrl: './video-season.component.html',
  styleUrl: './video-season.component.css',
})
export class VideoSeasonComponent {
  constructor(
    private readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService
  ) {}

  public isLoading: boolean = false;

  @Input() video: Video = defaultVideo;

  getEpisodes(event: any) {
    const season = this.findSeason(event.index, this.video.serieDetails!.seasons);
    if(this.checkIfSeasonHasEpisodes(season!)) {
      return;
    }
    this.isLoading = true;
    this.videoService.getEpisodes(this.video.id, event.index).subscribe({
      next: (episodes) => {
        season!.episodes = episodes;
      },
      error: (error) => {
        this.notificationService.showError('Erreur episodes', error.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  checkIfSeasonHasEpisodes(season: SeasonDetails): boolean {
    return season.episodes.length !== 0;
  }

  findSeason(seasonNumber: number, seasons: SeasonDetails[]): SeasonDetails | undefined {
    return seasons.find((season) => season.seasonNumber === seasonNumber);  
  }

  setImageUrl(url: string | null | undefined): string {
    return setImageUrl(url);
  }
}
