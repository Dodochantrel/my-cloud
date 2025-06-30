import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { updateFailedInputs } from '../../../tools/update-failed-inputs';
import { TastingService } from '../../../services/tasting.service';
import { NotificationService } from '../../../services/notification.service';
import { TastingCategory } from '../../../class/tasting-category';

@Component({
  selector: 'app-add-or-update-tasting',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
  ],
  templateUrl: './add-or-update-tasting.component.html',
  styleUrl: './add-or-update-tasting.component.css',
})
export class AddOrUpdateTastingComponent {
  @Input() isDisplayed: boolean = false;
  @Output() isDisplayedChange = new EventEmitter<boolean>();
  @Input() categories: TastingCategory[] = [];

  private readonly formBuilder = inject(FormBuilder);

  public isLoadingEditOrAdd: boolean = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly tastingService: TastingService,
  ) {}

  form = this.formBuilder.group({
    name: ['', Validators.required],
  });

  cancel() {
    this.form.reset();
    this.isDisplayedChange.emit(this.isDisplayed);
  }

  valid() {
    if (this.form.valid) {

    } else {
      updateFailedInputs(this.form);
    }
  }
}
