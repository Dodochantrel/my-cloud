import { AgendaEvent } from '../class/agenda-event';
import { AgendaEventCategoryDto, mapFromAgendaEventCategoryDtoToAgendaEventCategory,  } from './agenda-event-category.dto';

export interface AgendaEventDto {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isEveryYear: boolean;
  isEveryMonth: boolean;
  isEveryWeek: boolean;
  type: AgendaEventCategoryDto | null;
}

export const mapFromDtoToAgendaEvent = (dto: AgendaEventDto): AgendaEvent => {
  const event = new AgendaEvent(
    dto.id,
    dto.name,
    dto.description,
    new Date(dto.startDate),
    new Date(dto.endDate),
    dto.type ? mapFromAgendaEventCategoryDtoToAgendaEventCategory(dto.type) : null
  );
  event.isEveryYear = dto.isEveryYear;
  event.isEveryMonth = dto.isEveryMonth;
  event.isEveryWeek = dto.isEveryWeek;
  return event;
};

export const mapFromDtosToAgendaEvents = (
  dtos: AgendaEventDto[]
): AgendaEvent[] => {
  return dtos.map((dto) => mapFromDtoToAgendaEvent(dto));
};
