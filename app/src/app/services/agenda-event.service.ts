import { effect, Injectable, signal } from '@angular/core';
import { AgendaEvent } from '../class/agenda-event';
import { map, Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import {
  AgendaEventDto,
  mapFromDtosToAgendaEvents,
} from '../dto/agenda-event.dto';
import { environment } from '../../environments/environment.development';
import { AgendaEventCategory } from '../class/agenda-event-category';

@Injectable({
  providedIn: 'root',
})
export class AgendaEventService {
  constructor(private readonly httpClient: HttpClient) {
    effect(() => {
      // A chaque mofif de agendaEvents, on met à jour calendarEventsSignal
      this.calendarEventsSignal.set(
        this.mapFromAgendaEventsToEvents(this.agendaEvents())
      );
      if(this.viewDate()){
        this.setDateInUrl();
      }
    });
  }

  public viewDate = signal(new Date());
  public agendaEvents = signal<AgendaEvent[]>([]);
  public calendarEventsSignal = signal<CalendarEvent[]>([]);

  public eventsOfDate: AgendaEvent[] = [];
  public selectedDate: Date | null = null;

  public start = signal(new Date());
  public end = signal(new Date());

  public isAddingOrUpdating = signal(false);

  public agendaEventEditing: AgendaEvent | null = null;

  getAll(from: Date, to: Date, search: string): Observable<AgendaEvent[]> {
    return this.httpClient
      .get<AgendaEventDto[]>(
        `${
          environment.apiUrl
        }events?from=${from.toISOString()}&to=${to.toISOString()}&search=${search}`
      )
      .pipe(
        map((events: AgendaEventDto[]) => mapFromDtosToAgendaEvents(events))
      );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}events/${id}`);
  }

  mapFromAgendaEventsToEvents(agendaEvents: AgendaEvent[]): CalendarEvent[] {
    return agendaEvents.map((agendaEvent) => {
      return {
        id: agendaEvent.id,
        start: agendaEvent.startDatetime,
        end: agendaEvent.startDatetime,
        title: agendaEvent.name,
      };
    });
  }

  create(
    name: string,
    type: AgendaEventCategory | null,
    isEveryWeek: boolean,
    isEveryMonth: boolean,
    isEveryYear: boolean,
    startDatetime: Date,
    endDatetime: Date,
    groupsId: number
  ): Observable<AgendaEvent[]> {
    console.log(type);
    const body = {
      name: name,
      eventsDataCategoryId: type ? type.id : null,
      isEveryWeek: isEveryWeek,
      isEveryMonth: isEveryMonth,
      isEveryYear: isEveryYear,
      startDate: startDatetime,
      endDate: endDatetime,
      groupsId: groupsId,
    };

    return this.httpClient
      .post<AgendaEventDto[]>(`${environment.apiUrl}events`, body)
      .pipe(map((event) => mapFromDtosToAgendaEvents(event)));
  }

  edit(
    id: number,
    name: string,
    type: AgendaEventCategory | null,
    isEveryWeek: boolean,
    isEveryMonth: boolean,
    isEveryYear: boolean,
    startDatetime: Date,
    endDatetime: Date,
    groupsId: number
  ): Observable<AgendaEvent[]> {
    const body = {
      name: name,
      typeId: type ? type.id : null,
      isEveryWeek: isEveryWeek,
      isEveryMonth: isEveryMonth,
      isEveryYear: isEveryYear,
      startDate: startDatetime,
      endDate: endDatetime,
      groupsId: groupsId,
    };

    return this.httpClient
      .put<AgendaEventDto[]>(`${environment.apiUrl}events/${id}`, body)
      .pipe(map((event) => mapFromDtosToAgendaEvents(event)));
  }

  goPreviousMonth(): void {
    this.viewDate.update((date) => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - 1);
      return newDate;
    });
  }

  goNextMonth(): void {
    this.viewDate.update((date) => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      return newDate;
    });
  }

  setDateInUrl(): void {
    // Mettre dans l'url la date visible
    const month = this.viewDate().getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : month;
    const day = this.viewDate().getDate();
    const dayString = day < 10 ? `0${day}` : day;
    history.replaceState(
      {},
      '',
      `/events?date=${this.viewDate().getFullYear()}-${monthString}-${dayString}`
    );
  }

  setDateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      const date = new Date(dateParam);
      if (!isNaN(date.getTime())) {
        this.viewDate.set(date);
      } else {
        this.viewDate.set(new Date());
      }
    } else {
      this.viewDate.set(new Date());
    }
  }
}
