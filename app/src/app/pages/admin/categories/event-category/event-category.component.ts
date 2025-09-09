import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FooterTableComponent, SizeType } from '../../../../components/footer-table/footer-table.component';
import { AgendaEventCategoryService } from '../../../../services/agenda-event-category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-category',
  imports: [CommonModule, InputTextModule, IconFieldModule, InputIconModule, TableModule, ButtonModule, FooterTableComponent, FormsModule],
  templateUrl: './event-category.component.html',
  styleUrl: './event-category.component.css'
})
export class EventCategoryComponent {
  constructor(
    protected readonly agendaEventCategoryService: AgendaEventCategoryService,
  ) { }

  public selectedSize: SizeType = undefined;
}
