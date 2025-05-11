import { AgendaEvent, AgendaEventType } from '../class/agenda-event';

export interface AgendaEventDto {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export const mapFromDtoToAgendaEvent = (dto: AgendaEventDto): AgendaEvent => {
  return new AgendaEvent(
    dto.id,
    dto.name,
    dto.description,
    new Date(dto.startDate),
    new Date(dto.endDate),
    new AgendaEventType(1, 'Anniversaire', '#FF5733')
  );
};

export const mapFromDtosToAgendaEvents = (
  dtos: AgendaEventDto[]
): AgendaEvent[] => {
  return dtos.map((dto) => mapFromDtoToAgendaEvent(dto));
};
