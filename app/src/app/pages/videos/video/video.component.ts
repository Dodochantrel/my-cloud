import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CurrentVideosComponent } from '../../../components/videos/current-videos/current-videos.component';
import { WatchVideosComponent } from '../../../components/videos/watch-videos/watch-videos.component';
import { VideoService } from '../../../services/video.service';
import { Router, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs';
import { TabsModule } from 'primeng/tabs';
import { SeenVideosComponent } from '../../../components/videos/seen-videos/seen-videos.component';

@Component({
  selector: 'app-video',
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
    TabsModule,
    SeenVideosComponent,
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit {
  constructor(
    protected readonly videoService: VideoService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      this.setTypeWithUrl();
    });
    this.setTypeWithUrl();
  }

  onVideoSelect(event: any) {
    this.router.navigate([`videos/details/${this.videoService.type()}/${event.value.id}`]);
  }

  setTypeWithUrl() {
    if (this.router.url.includes('movies')) {
      this.videoService.type.set('movie');
    } else if (this.router.url.includes('series')) {
      this.videoService.type.set('serie');
    }
  }

  getTypeString(): string {
    return this.videoService.type() === 'movie' ? 'films' : 'séries';
  }
}
