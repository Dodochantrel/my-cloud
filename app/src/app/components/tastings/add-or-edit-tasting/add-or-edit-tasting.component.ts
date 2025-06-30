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
import { TreeNode } from 'primeng/api';
import { TreeSelectModule } from 'primeng/treeselect';
import { RatingModule } from 'primeng/rating';
import { EditorModule } from 'primeng/editor';
import { defaultTasting, Tasting } from '../../../class/tasting';

@Component({
  selector: 'app-add-or-edit-tasting',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    TreeSelectModule,
    RatingModule,
    EditorModule,
  ],
  templateUrl: './add-or-edit-tasting.component.html',
  styleUrl: './add-or-edit-tasting.component.css',
})
export class AddOrEditTastingComponent {
  @Input() isDisplayed: boolean = false;
  @Output() isDisplayedChange = new EventEmitter<boolean>();
  @Input() categories: TreeNode<TastingCategory>[] = [];
  @Output() newTasting = new EventEmitter<Tasting>();

  private readonly formBuilder = inject(FormBuilder);

  public isLoadingEditOrAdd: boolean = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly tastingService: TastingService,
  ) {}

  form = this.formBuilder.group({
    name: ['', Validators.required],
    category: [defaultTasting, Validators.required],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    description: [''],
  });

  cancel() {
    console.log('cancel');
    this.form.reset();
    this.isDisplayedChange.emit(this.isDisplayed);
  }

  valid() {
    if (this.form.valid) {
      this.save();
    } else {
      updateFailedInputs(this.form);
    }
  }

  save() {
    this.isLoadingEditOrAdd = true;
    this.tastingService
      .add(
        this.form.value.name!,
        this.form.value.category!.id!,
        this.form.value.rating!,
        this.form.value.description!,
      ).subscribe({
        next: (tasting) => {
          this.notificationService.showSuccess('Succès', `La dégustation a été ajoutée avec succès`);
          this.isDisplayedChange.emit(false);
          this.form.reset();
          this.isLoadingEditOrAdd = false;
          this.newTasting.emit(tasting);
        },
        error: (error) => {
          this.notificationService.showError('Erreur', `La dégustation n'a pas pu être ajoutée`);
          this.isLoadingEditOrAdd = false;
        },
        complete: () => {
          this.isLoadingEditOrAdd = false;
        },
      })
  }
}
