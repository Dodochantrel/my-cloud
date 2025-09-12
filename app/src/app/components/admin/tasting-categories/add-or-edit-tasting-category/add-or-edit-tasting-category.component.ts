import { Component, inject } from '@angular/core';
import { TastingCategoryService } from '../../../../services/tasting-category.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-add-or-edit-tasting-category',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ColorPickerModule,
  ],
  templateUrl: './add-or-edit-tasting-category.component.html',
  styleUrl: './add-or-edit-tasting-category.component.css'
})
export class AddOrEditTastingCategoryComponent {
  constructor(
    protected readonly tastingCategoryService: TastingCategoryService,
  ) { }

  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    color: ['111111', [Validators.required, Validators.pattern(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)]],
    icon: [''],
  });

  cancel() {
    this.tastingCategoryService.isCreatingOrUpdating.set(false);
    this.tastingCategoryService.tastingCategoryEditing.set(null);
    this.form.reset();
  }
}
