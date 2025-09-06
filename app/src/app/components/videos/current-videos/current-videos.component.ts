import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { Video, VideoType } from '../../../class/video';
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
    protected readonly videoService: VideoService,
    private readonly browserService: BrowserService,
    private readonly router: Router
  ) {}

  @Input() public type: VideoType = 'movie';
  public isLoadingData: boolean = false;

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getData();
    }
  }

  goToDetails(id: number) {
    this.router.navigate([`videos/details/${this.type}/${id}`]);
  }

  getData() {
    if(this.type === 'movie') {
      this.videoService.type.set('movie');
    } else if(this.type === 'serie') {
      this.videoService.type.set('serie');
    }
  }
}
