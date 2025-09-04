import { CommonModule } from '@angular/common';
import { AgendaEvent } from './../../../class/agenda-event';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { NotificationService } from '../../../services/notification.service';
import { AgendaEventService } from '../../../services/agenda-event.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-events-of-date',
  imports: [CommonModule, DrawerModule, ButtonModule],
  templateUrl: './events-of-date.component.html',
  styleUrl: './events-of-date.component.css',
})
export class EventsOfDateComponent {

  constructor(
    private readonly notificationService: NotificationService,
    protected readonly agendaEventService: AgendaEventService
  ) {}

  get isSidebarVisible(): boolean {
    return this.agendaEventService.selectedDate !== null;
  }

  set isSidebarVisible(value: boolean) {
    if (!value) {
      this.agendaEventService.selectedDate = null;
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
        this.removeAgendaEvent(agendaEvent);
        this.agendaEventService.eventsOfDate = this.agendaEventService.agendaEvents().filter(
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

  openEdit(agendaEvent: AgendaEvent): void {
    this.agendaEventService.isAddingOrUpdating.set(true);
    this.agendaEventService.agendaEventEditing = agendaEvent;
  }

  openWithDate(date: Date): void {
    this.agendaEventService.isAddingOrUpdating.set(true);
    this.agendaEventService.selectedDate = date;
  }

  removeAgendaEvent(agendaEvent: AgendaEvent): void {
      this.agendaEventService.agendaEvents.set(
        this.agendaEventService.agendaEvents().filter(
          (event) => event.id !== agendaEvent.id
        )
      );
      this.agendaEventService.eventsOfDate = this.agendaEventService.eventsOfDate.filter(
        (event) => event.id !== agendaEvent.id
      );
    }
}
