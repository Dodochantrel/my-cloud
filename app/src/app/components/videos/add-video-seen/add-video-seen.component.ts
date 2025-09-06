import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { NotificationService } from '../../../services/notification.service';
import { VideoService } from '../../../services/video.service';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { defaultVideo, Video } from '../../../class/video';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-add-video-seen',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    ToggleButtonModule,
    RatingModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
  ],
  templateUrl: './add-video-seen.component.html',
  styleUrl: './add-video-seen.component.css',
})
export class AddVideoSeenComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() video: Video = defaultVideo;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() saveVideo: EventEmitter<Video> = new EventEmitter<Video>();

  private formBuilder = inject(FormBuilder);

  public isLoading: boolean = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly videoService: VideoService
  ) {
    // S'abonner au formulaire et a isSeen
    this.form.get('isSeen')?.valueChanges.subscribe((value) => {
      if (value === false) {
        this.form.get('dateSeen')?.setValue(null);
        this.form.get('rating')?.setValue(null);
      }
    });
  }

  form = this.formBuilder.group({
    isSeen: [false, Validators.required],
    dateSeen: [null as Date | null],
    rating: [null as number | null],
  });

  ngOnChanges(): void {
    this.patchForm(this.video);
  }

  onClose() {
    this.close.emit();
    this.form.reset();
  }

  save() {
    this.isLoading = true;
    this.videoService.setSeen(this.video, this.form.value.isSeen!, this.form.value.dateSeen!, this.form.value.rating!).subscribe({
      next: (video) => {
        if(this.form.value.isSeen === false) {
          this.notificationService.showSuccess('Retirer des vues', `${video.title} a été retiré des vues`);
        } else {
          this.notificationService.showInfo('Ajouter aux vue', `${video.title} a été ajouté aux vues`);
        }
        this.close.emit();
        this.saveVideo.emit(video);
      },
      error: (error) => {
        this.notificationService.showError('Erreur', error.error.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  patchForm(video: Video) {
    this.form.patchValue({
      isSeen: video.isSeen,
      dateSeen: video.dateSeen,
      rating: video.rating,
    });
  }
}