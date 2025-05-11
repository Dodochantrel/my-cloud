import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

registerLocaleData(localeFr);

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, CalendarModule, ButtonModule],
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
  public viewDate: Date = new Date();
  public locale: string = 'fr';
  public agendaEvents: AgendaEvent[] = [];

  constructor(
    private router: Router,
    readonly agendaEventService: AgendaEventService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    this.getAll(start, end);
  }

  goPreviousMonth(): void {
    this.viewDate = new Date(
      this.viewDate.setMonth(this.viewDate.getMonth() - 1)
    );
  }

  goNextMonth(): void {
    this.viewDate = new Date(
      this.viewDate.setMonth(this.viewDate.getMonth() + 1)
    );
  }

  goToday(): void {
    this.viewDate = new Date();
  }

  // Modification ici : Type de paramètre
  onDayClick({ day }: { day: MonthViewDay }) {
    console.log(day);
  }

  getAll(from: Date, to: Date): void {
    this.agendaEventService.getAll(from, to, '').subscribe({
      next: (events) => {
        this.agendaEvents = events;
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
