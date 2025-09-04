import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarModule,
} from 'angular-calendar';
import { ButtonModule } from 'primeng/button';
import { CustomDateFormatter } from '../../../providers/custom-date-formateur.provider';
import { AgendaEventService } from '../../../services/agenda-event.service';
import { WeekDay } from 'calendar-utils';
import localeFr from '@angular/common/locales/fr';
import { NotificationService } from '../../../services/notification.service';
import { CreateOrUpdateEventComponent } from '../create-or-update-event/create-or-update-event.component';
import { EventsOfDateComponent } from '../events-of-date/events-of-date.component';

registerLocaleData(localeFr);

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    CalendarModule,
    ButtonModule,
    CreateOrUpdateEventComponent,
    EventsOfDateComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit {
  public locale: string = 'fr';

  constructor(
    readonly agendaEventService: AgendaEventService,
    private readonly notificationService: NotificationService
  ) {
    effect(() => {
      if (this.agendaEventService.viewDate() < this.agendaEventService.start()) {
        const newStart = new Date(this.agendaEventService.start());
        newStart.setFullYear(this.agendaEventService.start().getFullYear() - 1);
        this.agendaEventService.start.set(newStart);
        this.getAll(this.agendaEventService.start(), this.agendaEventService.viewDate());
      }
      if( this.agendaEventService.viewDate() > this.agendaEventService.end()) {
        const newEnd = new Date(this.agendaEventService.end());
        newEnd.setFullYear(this.agendaEventService.end().getFullYear() + 1);
        this.agendaEventService.end.set(newEnd);
        this.getAll(this.agendaEventService.viewDate(), this.agendaEventService.end());
      }
    });
  }

  ngOnInit(): void {
    this.agendaEventService.agendaEvents.set([]);
    this.agendaEventService.setDateFromUrl();
    this.agendaEventService.start().setFullYear(this.agendaEventService.start().getFullYear() - 1);
    this.agendaEventService.end().setFullYear(this.agendaEventService.end().getFullYear() + 1);
    this.getAll(this.agendaEventService.start(), this.agendaEventService.end());
  }
  
  goToday(): void {
    this.agendaEventService.viewDate.set(new Date());
  }  

  // Modification ici : Type de paramètre
  onDayClick({ day }: { day: MonthViewDay }) {
    this.agendaEventService.selectedDate = day.date;
    // Chercher les événements de la date sélectionnée dans agendaEvents
    this.agendaEventService.eventsOfDate = this.agendaEventService.agendaEvents().filter((event) => {
      return (
        event.startDatetime.getDate() === day.date.getDate() &&
        event.startDatetime.getMonth() === day.date.getMonth() &&
        event.startDatetime.getFullYear() === day.date.getFullYear()
      );
    });
  }

  getAll(from: Date, to: Date): void {
    this.agendaEventService.getAll(from, to, '').subscribe({
      next: (events) => {
        this.agendaEventService.agendaEvents.set([
          ...this.agendaEventService.agendaEvents(),
          ...events,
        ]);
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de la récupération des événements',
          error.message
        );
      },
    });
  }
}

export interface MonthViewDay<MetaType = any> extends WeekDay {
  inMonth: boolean;
  events: CalendarEvent[];
  backgroundColor?: string;
  badgeTotal: number;
  meta?: MetaType;
}
