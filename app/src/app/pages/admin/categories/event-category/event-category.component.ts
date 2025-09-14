import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import {
  FooterTableComponent,
  SizeType,
} from '../../../../components/footer-table/footer-table.component';
import { AgendaEventCategoryService } from '../../../../services/agenda-event-category.service';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { AddOrEditEventCategoryComponent } from '../../../../components/admin/event-categories/add-or-edit-event-category/add-or-edit-event-category.component';
import { AgendaEventCategory } from '../../../../class/agenda-event-category';
import { NotificationService } from '../../../../services/notification.service';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-event-category',
  imports: [
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TableModule,
    ButtonModule,
    FooterTableComponent,
    FormsModule,
    CheckboxModule,
    AddOrEditEventCategoryComponent,
    ColorPickerModule,
  ],
  templateUrl: './event-category.component.html',
  styleUrl: './event-category.component.css',
})
export class EventCategoryComponent implements OnInit {
  constructor(
    protected readonly agendaEventCategoryService: AgendaEventCategoryService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.agendaEventCategoryService.refresh();
  }

  public selectedSize: SizeType = undefined;

  prepareEdit(eventCategory: AgendaEventCategory) {
    this.agendaEventCategoryService.categoryToEdit.set(eventCategory);
    this.agendaEventCategoryService.isAddingOrEditing.set(true);
  }

  prepareDelete(eventCategory: AgendaEventCategory, event: Event) {
    this.notificationService.confirm(
      event,
      'Confirmation',
      `Êtes-vous sûr de vouloir supprimer la catégorie d'évennement "${eventCategory.name}" ?`,
      () => {
        this.agendaEventCategoryService.delete(eventCategory.id);
      },
      () => {
        this.notificationService.showInfo(
          'Suppression annulée',
          `La catégorie d'évennement n'a pas été supprimée`
        );
      }
    );
  }
}
