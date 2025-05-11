import { Injectable } from '@angular/core';
import { AgendaEvent } from '../class/agenda-event';
import { map, Observable, of } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import {
  AgendaEventDto,
  mapFromDtosToAgendaEvents,
} from '../dto/agenda-event.dto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AgendaEventService {
  constructor(private readonly httpClient: HttpClient) {}

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

  mapFromAgendaEventsToEvents(agendaEvents: AgendaEvent[]): CalendarEvent[] {
    return agendaEvents.map((agendaEvent) => {
      return {
        id: agendaEvent.id,
        start: agendaEvent.startDate,
        end: agendaEvent.endDate,
        title: agendaEvent.name,
      };
    });
  }
}
