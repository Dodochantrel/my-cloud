import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
import { FileUploadModule } from 'primeng/fileupload';
import { setImageUrl } from '../../../tools/set-image-url';

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
    FileUploadModule,
  ],
  templateUrl: './add-or-edit-tasting.component.html',
  styleUrl: './add-or-edit-tasting.component.css',
})
export class AddOrEditTastingComponent implements OnChanges {
  @Input() isDisplayed: boolean = false;
  @Output() isDisplayedChange = new EventEmitter<boolean>();
  @Input() categories: TreeNode<TastingCategory>[] = [];
  @Output() newTasting = new EventEmitter<Tasting>();
  @Input() tastingToEdit: Tasting | null = null;
  @Output() tastingToEditChange = new EventEmitter<Tasting | null>();

  private readonly formBuilder = inject(FormBuilder);

  public isLoadingEditOrAdd: boolean = false;
  public previewUrl: string | null = null;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly tastingService: TastingService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.patchForm();
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    category: [null as any, Validators.required],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    description: [''],
    image: [null as File | null],
  });

  patchForm() {
    if(this.tastingToEdit) {
      //Trouver dans categories le bon TastingCategory
      const categoryNode = this.categories.find(
        (node) => node.data!.id === this.tastingToEdit!.category?.id
      );
      this.form.patchValue({
        name: this.tastingToEdit.name,
        category: categoryNode,
        rating: this.tastingToEdit.rating,
        description: this.tastingToEdit.description,
      });
      this.previewUrl = this.tastingToEdit.fileBlobUrl || null;
    }
  }

  cancel() {
    this.form.reset();
    this.isDisplayed = false;
    this.isDisplayedChange.emit(this.isDisplayed);
  }

  valid() {
    if (this.form.valid) {
      if(this.tastingToEdit) {
        this.edit();
      } else {
        this.save();
      }
    } else {
      updateFailedInputs(this.form);
    }
  }

  setImageUrl(url: string | null | undefined): string {
    return setImageUrl(url);
  }

  edit() {
    this.isLoadingEditOrAdd = true;
    this.tastingService
      .edit(
        this.tastingToEdit!.id,
        this.form.value.name!,
        this.form.value.category!.data!.id!,
        this.form.value.rating!,
        this.form.value.description!
      )
      .subscribe({
        next: (tasting) => {
          this.notificationService.showSuccess(
            'Succès',
            `La dégustation a été modifiée avec succès`
          );
          tasting.fileBlobUrl = this.previewUrl; // Update the fileBlobUrl with the preview URL
          this.uploadFile(tasting.id);
          this.isDisplayedChange.emit(false);
          this.form.reset();
          this.isLoadingEditOrAdd = false;
          this.tastingToEditChange.emit(tasting);
          this.previewUrl = null;
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur',
            `La dégustation n'a pas pu être modifiée`
          );
          this.isLoadingEditOrAdd = false;
        },
        complete: () => {
          this.isLoadingEditOrAdd = false;
        },
      });
  }

  save() {
    this.isLoadingEditOrAdd = true;
    this.tastingService
      .add(
        this.form.value.name!,
        this.form.value.category!.data!.id!,
        this.form.value.rating!,
        this.form.value.description!
      )
      .subscribe({
        next: (tasting) => {
          this.notificationService.showSuccess(
            'Succès',
            `La dégustation a été ajoutée avec succès`
          );
          this.uploadFile(tasting.id);
          this.isDisplayedChange.emit(false);
          this.form.reset();
          this.isLoadingEditOrAdd = false;
          this.newTasting.emit(tasting);
          this.previewUrl = null; // Reset preview URL after saving
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur',
            `La dégustation n'a pas pu être ajoutée`
          );
          this.isLoadingEditOrAdd = false;
        },
        complete: () => {
          this.isLoadingEditOrAdd = false;
        },
      });
  }

  onFileSelect(event: any): void {
    const file: File = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.form.get('image')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile(id: number) {
    const file = this.form.get('image')?.value;
    if (file) {
      this.tastingService.uploadFile(id, file).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Image enregistrée',
            'L\'image a été enregistré avec succès.'
          );
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur lors de l\'enregistremement de l\'image',
            'Une erreur est survenue lors de l\'enregistremement de l\'image.'
          );
        },
      });
    }
  }
}
