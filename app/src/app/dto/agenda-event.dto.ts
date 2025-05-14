import { AgendaEvent } from '../class/agenda-event';
import { AgendaEventTypeDto, mapFromAgendaEventTypeToAgendaEventTypeDto } from './agenda-event-type.dto';

export interface AgendaEventDto {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: AgendaEventTypeDto;
}

export const mapFromDtoToAgendaEvent = (dto: AgendaEventDto): AgendaEvent => {
  return new AgendaEvent(
    dto.id,
    dto.name,
    dto.description,
    new Date(dto.startDate),
    new Date(dto.endDate),
    mapFromAgendaEventTypeToAgendaEventTypeDto(dto.type)
  );
};

export const mapFromDtosToAgendaEvents = (
  dtos: AgendaEventDto[]
): AgendaEvent[] => {
  return dtos.map((dto) => mapFromDtoToAgendaEvent(dto));
};
