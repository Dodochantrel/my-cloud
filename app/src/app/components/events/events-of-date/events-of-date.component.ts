import { CommonModule } from '@angular/common';
import { AgendaEvent } from './../../../class/agenda-event';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-events-of-date',
  imports: [SidebarModule, CommonModule],
  templateUrl: './events-of-date.component.html',
  styleUrl: './events-of-date.component.css'
})
export class EventsOfDateComponent {
  @Input() selectedDate: Date | null = null;
  @Output() selectedDateChange = new EventEmitter<null>();
  @Input() agendaEvents: AgendaEvent[] = [];

  constructor() {}

  get isSidebarVisible(): boolean {
    return this.selectedDate !== null;
  }

  set isSidebarVisible(value: boolean) {
    if (!value) {
      this.selectedDateChange.emit(null);
    }
  }

}
