import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Group } from '../../../class/group';
import { BrowserService } from '../../../services/browser.service';
import { GroupService } from '../../../services/group.service';
import { NotificationService } from '../../../services/notification.service';
import { PictureCategory } from '../../../class/picture-category';
import { PictureService } from '../../../services/picture.service';
import { updateFailedInputs } from '../../../tools/update-failed-inputs';

@Component({
  selector: 'app-add-or-edit-picture-category',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
  ],
  templateUrl: './add-or-edit-picture-category.component.html',
  styleUrl: './add-or-edit-picture-category.component.css',
})
export class AddOrEditPictureCategoryComponent implements OnInit {
  public myGroups: Group[] = [];

  private readonly formBuilder = inject(FormBuilder);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly browserService: BrowserService,
    private readonly groupService: GroupService,
    protected readonly pictureService: PictureService
  ) {
    effect(() => {
      if(this.pictureService.selectedCategory() && !this.pictureService.isCreatingNewCategory) {
        this.form.patchValue({
          name: this.pictureService.selectedCategory()!.name,
          groups: this.pictureService.selectedCategory()!.groupsId,
        });
      } else {
        this.form.reset();
      }
    });
  }

  ngOnInit(): void {
    if(this.browserService.isBrowser) {
      this.getGroups();
    }
  }

  public form = this.formBuilder.group({
    name: ['', Validators.required],
    groups: [<number[]>[]],
  });

  cancel() {
    this.form.reset();
    this.pictureService.isAddingOrEditingCategory.set(false);
  }

  getGroups() {
    this.groupService.getAllMinimal().subscribe({
      next: (groups) => {
        this.myGroups = groups;
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          "Erreur lors de la récupération des groupes d'événements"
        );
      },
    });
  }

  valid() {
    if(this.form.valid) {
      this.pictureService.isLoadingCreateOrEdit = true;
      if(this.pictureService.selectedCategory() && !this.pictureService.isCreatingNewCategory) {
        this.edit();
      } else {
        this.create();
      }
    } else {
      this.notificationService.showError(
        'Erreur',
        'Veuillez remplir tous les champs requis.'
      );
      updateFailedInputs(this.form);
    }
  }

  edit() {
    this.pictureService.editPictureCategory(
      this.pictureService.selectedCategory()!.id,
      this.form.value.name!,
      this.form.value.groups!,
    );
  }

  create() {
    this.pictureService.createPictureCategory(
      this.form.value.name!,
      this.form.value.groups!,
      this.pictureService.selectedCategory() ? this.pictureService.selectedCategory()!.id : null,
    );
  }
}
