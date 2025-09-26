import { Component, input } from '@angular/core';

@Component({
  selector: 'app-seen-video-stat-bloc',
  imports: [],
  templateUrl: './seen-video-stat-bloc.component.html',
  styleUrl: './seen-video-stat-bloc.component.css'
})
export class SeenVideoStatBlocComponent {
  public icon = input.required<string>();
  public title = input.required<string>();
  public value = input.required<string>();
}
