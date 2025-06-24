import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
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
export class AddOrEditPictureCategoryComponent implements OnChanges, OnInit {
  @Input() isDisplayed: boolean = false;
  @Output() isDisplayedChange = new EventEmitter<boolean>();
  @Input() pictureCategory: PictureCategory | null = null;
  @Input() isEditMode: boolean = false;
  @Output() newCategoryCreated = new EventEmitter<PictureCategory>();
  @Output() categoryEdited = new EventEmitter<PictureCategory>(); 

  public myGroups: Group[] = [];

  private readonly formBuilder = inject(FormBuilder);

  public isLoading: boolean = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly browserService: BrowserService,
    private readonly groupService: GroupService,
    private readonly pictureService: PictureService
  ) {}

  ngOnChanges(): void {
    if(this.browserService.isBrowser){
      if(this.pictureCategory && this.isEditMode) {
        this.form.patchValue({
          name: this.pictureCategory.name,
          groups: this.pictureCategory.groupsId || [],
        });
      }
    }
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
    this.isDisplayedChange.emit(false);
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
      this.isLoading = true;
      if(this.isEditMode) {
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
    this.pictureService.edit(
      this.pictureCategory!.id,
      this.form.value.name!,
      this.form.value.groups!,
    ).subscribe({
      next: (pictureCategory: PictureCategory) => {
        this.notificationService.showSuccess(
          'Succès',
          `La catégorie ${pictureCategory.name!} a été modifiée avec succès.`
        );
        this.isDisplayedChange.emit(false);
        this.categoryEdited.emit(pictureCategory);
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          `Erreur lors de la modification de la catégorie : ${error.message}`
        );
      },
      complete: () => {
        this.isLoading = false;
        this.form.reset();
      }
    });
  }

  create() {
    this.pictureService.create(
      this.form.value.name!,
      this.form.value.groups!,
      this.pictureCategory?.id
    ).subscribe({
      next: (pictureCategory: PictureCategory) => {
        this.notificationService.showSuccess(
          'Succès',
          `La catégorie ${pictureCategory.name!} a été créée avec succès.`
        );
        this.isDisplayedChange.emit(false);
        this.newCategoryCreated.emit(pictureCategory);
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          `Erreur lors de la création de la catégorie : ${error.message}`
        );
      },
      complete: () => {
        this.isLoading = false;
        this.form.reset();
      }
    });
  }
}
