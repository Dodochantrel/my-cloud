import { Component } from '@angular/core';
import { SeenVideoService } from '../../../services/seen-video.service';
import { SeenVideoStatBlocComponent } from '../seen-video-stat-bloc/seen-video-stat-bloc.component';

@Component({
  selector: 'app-seen-videos',
  standalone: true,
  imports: [SeenVideoStatBlocComponent],
  templateUrl: './seen-videos.component.html',
  styleUrl: './seen-videos.component.css'
})
export class SeenVideosComponent {
  constructor(
    protected readonly seenVideoService: SeenVideoService
  ) {}
}
