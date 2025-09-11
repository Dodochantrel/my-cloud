import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CurrentVideosComponent } from '../../../components/videos/current-videos/current-videos.component';
import { WatchVideosComponent } from '../../../components/videos/watch-videos/watch-videos.component';
import { FormsModule } from '@angular/forms';
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
export class SerieComponent implements OnInit {
  constructor(
    protected readonly videoService: VideoService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.videoService.refresh();
    this.videoService.refreshSeen();
  }

  onMovieSelect(event: any) {
    this.router.navigate([`videos/details/serie/${event.value.id}`]);
  }
}
