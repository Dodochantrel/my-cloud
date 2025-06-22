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
import { Router } from '@angular/router';
import { WeekDay } from 'calendar-utils';
import localeFr from '@angular/common/locales/fr';
import { AgendaEvent } from '../../../class/agenda-event';
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
  public viewDate = signal(new Date());
  public locale: string = 'fr';
  public agendaEvents: AgendaEvent[] = [];
  public calendarEventsSignal = signal<CalendarEvent[]>([]);

  public eventsOfDate: AgendaEvent[] = [];
  public selectedDate: Date | null = null;

  public start = signal(new Date());
  public end = signal(new Date());

  public isCreatingOrUpdating: boolean = false;

  public agendaEventEditing: AgendaEvent | null = null;

  constructor(
    readonly agendaEventService: AgendaEventService,
    private readonly notificationService: NotificationService
  ) {
    effect(() => {
      if (this.viewDate() < this.start()) {
        const newStart = new Date(this.start());
        newStart.setFullYear(this.start().getFullYear() - 1);
        this.start.set(newStart);
        this.getAll(this.start(), this.viewDate());
      }
      if( this.viewDate() > this.end()) {
        const newEnd = new Date(this.end());
        newEnd.setFullYear(this.end().getFullYear() + 1);
        this.end.set(newEnd);
        this.getAll(this.viewDate(), this.end());
      }
    });
  }

  ngOnInit(): void {
    this.start().setFullYear(this.start().getFullYear() - 1);
    this.end().setFullYear(this.end().getFullYear() + 1);
    this.getAll(this.start(), this.end());
  }

  goPreviousMonth(): void {
    this.viewDate.update(date => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - 1);
      return newDate;
    });
  }
  
  goNextMonth(): void {
    this.viewDate.update(date => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      return newDate;
    });
  }
  
  goToday(): void {
    this.viewDate.set(new Date());
  }  

  // Modification ici : Type de paramètre
  onDayClick({ day }: { day: MonthViewDay }) {
    this.selectedDate = day.date;
    // Chercher les événements de la date sélectionnée dans agendaEvents
    this.eventsOfDate = this.agendaEvents.filter((event) => {
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
        this.agendaEvents.push(...events);
        this.calendarEventsSignal.set(
          this.agendaEventService.mapFromAgendaEventsToEvents(this.agendaEvents)
        );
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de la récupération des événements',
          error.message
        );
      },
    });
  }

  addAgendaEvents(agendaEvents: AgendaEvent[]): void {
    this.agendaEvents = [...this.agendaEvents, ...agendaEvents];
    this.calendarEventsSignal.set(
      this.agendaEventService.mapFromAgendaEventsToEvents(this.agendaEvents)
    );
  }

  removeAgendaEvent(agendaEvent: AgendaEvent): void {
    this.agendaEvents = this.agendaEvents.filter(
      (event) => event.id !== agendaEvent.id
    );
    this.calendarEventsSignal.set(
      this.agendaEventService.mapFromAgendaEventsToEvents(this.agendaEvents)
    );
    this.eventsOfDate = this.eventsOfDate.filter(
      (event) => event.id !== agendaEvent.id
    );
  }

  openWithDate(date: Date): void {
    this.isCreatingOrUpdating = true;
    this.selectedDate = date;
  }

  openEdit(agendaEvent: AgendaEvent): void {
    this.isCreatingOrUpdating = true;
    this.agendaEventEditing = agendaEvent;
  }

  removeAgendaEventEdit() {
    this.agendaEventEditing = null;
  }

}

export interface MonthViewDay<MetaType = any> extends WeekDay {
  inMonth: boolean;
  events: CalendarEvent[];
  backgroundColor?: string;
  badgeTotal: number;
  meta?: MetaType;
}
