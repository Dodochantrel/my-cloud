import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { BrowserService } from '../../../services/browser.service';
import { VideoService } from '../../../services/video.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../loaders/loader/loader.component';

@Component({
  selector: 'app-current-videos',
  imports: [CarouselModule, ButtonModule, LoaderComponent],
  templateUrl: './current-videos.component.html',
  styleUrl: './current-videos.component.css',
})
export class CurrentVideosComponent {
  constructor(
    protected readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly router: Router
  ) {}

  public isLoadingData: boolean = false;

  goToDetails(id: number) {
    this.router.navigate([`videos/details/${this.videoService.type()}/${id}`]);
  }
}
