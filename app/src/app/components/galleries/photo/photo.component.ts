import { Component, effect, input } from '@angular/core';
import { PictureService } from '../../../services/picture.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-photo',
  imports: [],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.css'
})
export class PhotoComponent {
  categoryId = input<number>();

  constructor(
    private readonly pictureService: PictureService,
    private readonly notificationService: NotificationService,
  ) {
    effect(() => {
      console.log('Nouvel ID de catégorie :', this.categoryId());
    });
  }
  
}
