import { CommonModule } from '@angular/common';
import { AgendaEvent } from './../../../class/agenda-event';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { NotificationService } from '../../../services/notification.service';
import { AgendaEventService } from '../../../services/agenda-event.service';

@Component({
  selector: 'app-events-of-date',
  imports: [CommonModule, DrawerModule],
  templateUrl: './events-of-date.component.html',
  styleUrl: './events-of-date.component.css',
})
export class EventsOfDateComponent {
  @Input() selectedDate: Date | null = null;
  @Output() selectedDateChange = new EventEmitter<null>();
  @Input() agendaEvents: AgendaEvent[] = [];
  @Output() agendaEventDeleted = new EventEmitter<AgendaEvent>();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly agendaEventService: AgendaEventService
  ) {}

  get isSidebarVisible(): boolean {
    return this.selectedDate !== null;
  }

  set isSidebarVisible(value: boolean) {
    if (!value) {
      this.selectedDateChange.emit(null);
    }
  }

  prepareDelete(event: any, agendaEvent: AgendaEvent) {
    this.notificationService.confirm(
      event,
      'Suppression',
      'Voulez-vous supprimer cet évennement ?',
      () => {
        this.deleteGroup(agendaEvent);
      },
      () => {
        this.notificationService.showInfo('Annulé', 'Suppression annulée');
      }
    );
  }

  deleteGroup(agendaEvent: AgendaEvent): void {
    this.agendaEventService.delete(agendaEvent.id).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'Évennement supprimé',
          `L'évennement ${agendaEvent.name} a été supprimé avec succès`
        );
        this.agendaEventDeleted.emit(agendaEvent);
        this.agendaEvents = this.agendaEvents.filter(
          (event) => event.id !== agendaEvent.id
        );
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de la suppression du groupe',
          error.message
        );
      },
    });
  }
}
