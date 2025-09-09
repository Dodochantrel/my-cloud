import { AgendaEvent } from '../class/agenda-event';
import { AgendaEventCategoryDto, mapFromAgendaEventCategoryToAgendaEventCategoryDto } from './agenda-event-category.dto';

export interface AgendaEventDto {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: AgendaEventCategoryDto | null;
}

export const mapFromDtoToAgendaEvent = (dto: AgendaEventDto): AgendaEvent => {
  return new AgendaEvent(
    dto.id,
    dto.name,
    dto.description,
    new Date(dto.startDate),
    new Date(dto.endDate),
    dto.type ? mapFromAgendaEventCategoryToAgendaEventCategoryDto(dto.type) : null
  );
};

export const mapFromDtosToAgendaEvents = (
  dtos: AgendaEventDto[]
): AgendaEvent[] => {
  return dtos.map((dto) => mapFromDtoToAgendaEvent(dto));
};
