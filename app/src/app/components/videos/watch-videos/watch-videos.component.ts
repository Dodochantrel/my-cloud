import { Component, Input } from '@angular/core';
import { getTypeToDisplay, VideoType } from '../../../class/video';
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
export class WatchVideosComponent {
  constructor(
    protected readonly videoService: VideoService,
    private readonly router: Router
  ) {}

  @Input() public type: VideoType = 'movie';

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

  goToDetails(id: number) {
    this.router.navigate([`videos/details/${this.type}/${id}`]);
  }
}
