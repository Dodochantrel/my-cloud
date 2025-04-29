import { Component, Input } from '@angular/core';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { defaultVideo, SeasonDetails, Video } from '../../../class/video';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-video-season',
  imports: [CommonModule, AccordionModule],
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

  test(event: any) {
    console.log('test', event);
  }

  getEpisodes(seasonId: number) {
    console.log('getEpisodes', seasonId);
    this.isLoading = true;
    this.videoService.getEpisodes(seasonId).subscribe({
      next: (episodes) => {
        if(this.video.serieDetails?.seasons) {
          const season = this.findSeason(seasonId, this.video.serieDetails.seasons);
          if (season) {
            season.episodes = episodes;
          } else {
            this.notificationService.showError('Erreur saison', 'Saison introuvable');
          }
        }
      },
      error: (error) => {
        this.notificationService.showError('Erreur episodes', error.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  findSeason(seasonNumber: number, seasons: SeasonDetails[]): SeasonDetails | undefined {
    return seasons.find((season) => season.seasonNumber === seasonNumber);  
  }
}
