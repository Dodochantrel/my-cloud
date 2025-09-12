import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  model,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class AddOrEditTastingComponent {
  @Input() categories: TreeNode<TastingCategory>[] = [];

  private readonly formBuilder = inject(FormBuilder);

  constructor(
    protected readonly tastingService: TastingService
  ) {
    effect(() => {
      if (this.tastingService.tastingToEdit() !== null) {
        this.patchForm();
      } else {
        this.form.reset({
          name: '',
          category: null,
          rating: 0,
          description: '',
          image: null,
        });
        this.tastingService.previewUrl = null;
      }
    });
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    category: [null as any, Validators.required],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    description: [''],
    image: [null as File | null],
  });

  patchForm() {
    if (this.tastingService.tastingToEdit() !== null) {
      const categoryNode = this.findCategoryNode(
        this.categories,
        this.tastingService.tastingToEdit()!.category?.id!
      );

      this.form.patchValue({
        name: this.tastingService.tastingToEdit()!.name,
        category: categoryNode,
        rating: this.tastingService.tastingToEdit()!.rating,
        description: this.tastingService.tastingToEdit()!.description,
      });

      this.tastingService.previewUrl = this.tastingService.tastingToEdit()!.fileBlobUrl || null;
    }
  }

  private findCategoryNode(
    nodes: TreeNode<TastingCategory>[],
    id: string
  ): TreeNode<TastingCategory> | null {
    for (const node of nodes) {
      if (node.data && node.data.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const childResult = this.findCategoryNode(node.children, id);
        if (childResult) {
          return childResult;
        }
      }
    }
    return null;
  }

  cancel() {
    this.form.reset({
      name: '',
      category: null,
      rating: 0,
      description: '',
      image: null,
    });
    this.tastingService.previewUrl = null;
    this.tastingService.tastingToEdit.set(null);
    this.tastingService.isDisplayedCreateOrEdit = false;
  }

  valid() {
    if (this.form.valid) {
      if (this.tastingService.tastingToEdit() !== null) {
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
    this.tastingService.edit(
      this.tastingService.tastingToEdit()!.id,
      this.form.value.name!,
      this.form.value.category!.data!.id!,
      this.form.value.rating!,
      this.form.value.description!,
      this.form.value.image!
    );
  }

  save() {
    this.tastingService.add(
      this.form.value.name!,
      this.form.value.category!.data!.id!,
      this.form.value.rating!,
      this.form.value.description!,
      this.form.value.image!
    );
  }

  onFileSelect(event: any): void {
    const file: File = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.tastingService.previewUrl = reader.result as string;
        this.form.get('image')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }
}
