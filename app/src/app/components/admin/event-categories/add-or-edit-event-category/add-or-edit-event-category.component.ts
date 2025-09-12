import { Component, effect, inject } from '@angular/core';
import { AgendaEventCategoryService } from '../../../../services/agenda-event-category.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { updateFailedInputs } from '../../../../tools/update-failed-inputs';

@Component({
  selector: 'app-add-or-edit-event-category',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ColorPickerModule,
    ToggleSwitchModule,
    InputGroupModule, 
    InputGroupAddonModule
  ],
  templateUrl: './add-or-edit-event-category.component.html',
  styleUrl: './add-or-edit-event-category.component.css',
})
export class AddOrEditEventCategoryComponent {
  constructor(
    protected readonly agendaEventCategoryService: AgendaEventCategoryService
  ) {
    effect(() => {
      if (this.agendaEventCategoryService.isAddingOrEditing()) {
        this.form.reset({
          name: '',
          color: '111111',
          isEveryWeek: false,
          isEveryMonth: false,
          isEveryYear: false,
        });
        if (this.agendaEventCategoryService.categoryToEdit()) {
          const category = this.agendaEventCategoryService.categoryToEdit()!;
          this.form.setValue({
            name: category.name,
            color: category.color,
            isEveryWeek: category.isAutomaticallyEveryWeek,
            isEveryMonth: category.isAutomaticallyEveryMonth,
            isEveryYear: category.isAutomaticallyEveryYear,
          });
        }
      }
    });
  }

  public isLoadingAddingOrEditing: boolean = false;

  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    color: ['111111', [Validators.required, Validators.pattern(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)]],
    isEveryWeek: [false],
    isEveryMonth: [false],
    isEveryYear: [false],
  });

  onColorChange(newColor: any) {
    this.form.get('color')?.setValue(newColor, { emitEvent: false });
  }  

  save() {
    if (this.form.invalid) {
      updateFailedInputs(this.form);
    } else {
      if(this.agendaEventCategoryService.categoryToEdit()) {
        this.edit();
      } else {
        this.create();
      }
    }
  }

  create() {
    this.agendaEventCategoryService.create(
      this.form.value.name!,
      this.form.value.color!,
      this.form.value.isEveryWeek!,
      this.form.value.isEveryMonth!,
      this.form.value.isEveryYear!
    );
  }

  edit() {
    this.agendaEventCategoryService.edit(
      this.agendaEventCategoryService.categoryToEdit()!.id,
      this.form.value.name!,
      this.form.value.color!,
      this.form.value.isEveryWeek!,
      this.form.value.isEveryMonth!,
      this.form.value.isEveryYear!
    );
  }

  cancel() {
    this.agendaEventCategoryService.categoryToEdit.set(null);
    this.agendaEventCategoryService.isAddingOrEditing.set(false);
  }
}
