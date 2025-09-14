import { Component, effect, inject } from '@angular/core';
import { TastingCategoryService } from '../../../../services/tasting-category.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { updateFailedInputs } from '../../../../tools/update-failed-inputs';

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
    InputGroupModule, 
    InputGroupAddonModule,
    SelectModule,
  ],
  templateUrl: './add-or-edit-tasting-category.component.html',
  styleUrl: './add-or-edit-tasting-category.component.css'
})
export class AddOrEditTastingCategoryComponent {
  constructor(
    protected readonly tastingCategoryService: TastingCategoryService,
  ) {
    effect(() => {
      if(tastingCategoryService.isCreatingOrUpdating()) {
        this.patchForm();
      }
    });
  }

  patchForm() {
    // Si c'est une modif et que c'est une catégorie parente
    if(this.tastingCategoryService.tastingCategoryEditing() && this.tastingCategoryService.tastingCategoryEditing()!.parent === null) {
      this.form.patchValue({
        name: this.tastingCategoryService.tastingCategoryEditing()!.name,
        color: this.tastingCategoryService.tastingCategoryEditing()!.color,
        icon: this.tastingCategoryService.tastingCategoryEditing()!.icon,
      });
      this.form.get('color')?.setValidators([Validators.required, Validators.pattern(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)]);
      this.form.get('icon')?.setValidators([Validators.required]);
      this.form.get('color')?.updateValueAndValidity({ emitEvent: false });
      this.form.get('icon')?.updateValueAndValidity({ emitEvent: false });
    } else if(this.tastingCategoryService.tastingCategoryEditing() && this.tastingCategoryService.tastingCategoryEditing()!.parent !== null) {
      // Si c'est une modif et que c'est une sous-catégorie
      this.form.patchValue({
        name: this.tastingCategoryService.tastingCategoryEditing()!.name,
        color: null,
        icon:  null,
      });
      this.form.get('color')?.setValidators([]);
      this.form.get('icon')?.setValidators([]);
      this.form.get('color')?.updateValueAndValidity({ emitEvent: false });
      this.form.get('icon')?.updateValueAndValidity({ emitEvent: false });
    } else if(this.tastingCategoryService.isCreatingParentId()) {
      // Si c'est une création de sous-catégorie
      this.form.patchValue({
        name: '',
        color: null,
        icon: null,
      });
      this.form.get('color')?.setValidators([]);
      this.form.get('icon')?.setValidators([]);
      this.form.get('color')?.updateValueAndValidity({ emitEvent: false });
      this.form.get('icon')?.updateValueAndValidity({ emitEvent: false });
    } else if (!this.tastingCategoryService.isCreatingParentId()) {
      // Si c'est une création de catégorie parente
      this.form.patchValue({
        name: '',
        color: '111111',
        icon: '',
      });
      this.form.get('color')?.setValidators([Validators.required, Validators.pattern(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)]);
      this.form.get('icon')?.setValidators([Validators.required]);
      this.form.get('color')?.updateValueAndValidity({ emitEvent: false });
      this.form.get('icon')?.updateValueAndValidity({ emitEvent: false });
    }
  }

  canDisplayColorAndIconFields(): boolean {
    return this.tastingCategoryService.tastingCategoryEditing()?.parent === null || (this.tastingCategoryService.tastingCategoryEditing() === null && !this.tastingCategoryService.isCreatingParentId());
  }

  public isLoadingAddingOrEditing: boolean = false;

  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    color: ['111111', [Validators.required, Validators.pattern(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)]],
    icon: [''],
  });

  onColorChange(newColor: any) {
    this.form.get('color')?.setValue(newColor, { emitEvent: false });
  }  

  cancel() {
    this.tastingCategoryService.isCreatingOrUpdating.set(false);
    this.tastingCategoryService.tastingCategoryEditing.set(null);
    this.form.reset();
  }

  save() {
    if(this.form.invalid) {
      updateFailedInputs(this.form);
    } else {
      this.tastingCategoryService.tastingCategoryEditing() ? this.edit() : this.create();
    }
  }

  create() {
    this.tastingCategoryService.create(
      this.form.get('name')?.value!,
      this.canDisplayColorAndIconFields() ? this.form.get('color')?.value! : null,
      this.canDisplayColorAndIconFields() ? this.form.get('icon')?.value! : null,
      this.tastingCategoryService.isCreatingParentId()
    );
  }

  edit() {
    this.tastingCategoryService.edit(
      this.tastingCategoryService.tastingCategoryEditing()!.id,
      this.form.get('name')?.value!,
      this.canDisplayColorAndIconFields() ? this.form.get('color')?.value! : null,
      this.canDisplayColorAndIconFields() ? this.form.get('icon')?.value! : null,
    );
  }
}
