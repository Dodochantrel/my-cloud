import { Injectable } from '@angular/core';
import { AgendaEvent } from '../class/agenda-event';
import { map, Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import {
  AgendaEventDto,
  mapFromDtosToAgendaEvents,
  mapFromDtoToAgendaEvent,
} from '../dto/agenda-event.dto';
import { environment } from '../../environments/environment.development';
import { AgendaEventType } from '../class/agenda-event-type';
import { AgendaEventTypeDto, mapFromAgendaEventTypeToAgendaEventTypeDtos } from '../dto/agenda-event-type.dto';

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

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}events/${id}`);
  }

  getAllTypes(): Observable<AgendaEventType[]> {
    return this.httpClient
      .get<AgendaEventTypeDto[]>(`${environment.apiUrl}events/types`)
      .pipe(map(mapFromAgendaEventTypeToAgendaEventTypeDtos));
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

  create(name: string, type: AgendaEventTypeDto | null, isEveryWeek: boolean, isEveryMonth: boolean, isEveryYear: boolean, startDatetime: Date, endDatetime: Date, groupsId: number): Observable<AgendaEvent> {
    const body = {
      name: name,
      typeId: type ? type.id : null,
      isEveryWeek: isEveryWeek,
      isEveryMonth: isEveryMonth,
      isEveryYear: isEveryYear,
      startDate: startDatetime,
      endDate: endDatetime,
      groupsId: groupsId,
    }

    return this.httpClient
      .post<AgendaEventDto>(`${environment.apiUrl}events`, body)
      .pipe(map((event) => mapFromDtoToAgendaEvent(event)));
  }
}
