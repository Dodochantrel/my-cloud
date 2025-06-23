import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
  @Input() isDisplayed: boolean = false;
  @Output() isDisplayedChange = new EventEmitter<boolean>();
  @Input() pictureCategory: PictureCategory | null = null;

  public myGroups: Group[] = [];

  private readonly formBuilder = inject(FormBuilder);

  public isLoading: boolean = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly browserService: BrowserService,
    private readonly groupService: GroupService
  ) {}

  ngOnInit(): void {
    if(this.browserService.isBrowser){
      this.getGroups();
    }
  }

  public form = this.formBuilder.group({
    name: ['', Validators.required],
    groups: [null],
  });

  cancel() {
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
}
