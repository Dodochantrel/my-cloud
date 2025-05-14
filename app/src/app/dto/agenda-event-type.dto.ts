import { AgendaEventType } from "../class/agenda-event-type";

export interface AgendaEventTypeDto {
  id: number;
  name: string;
  color: string;
  isAutomaticallyEveryWeek: boolean;
  isAutomaticallyEveryMonth: boolean;
  isAutomaticallyEveryYear: boolean;
}

export const mapFromAgendaEventTypeToAgendaEventTypeDto = (
  agendaEventType: AgendaEventTypeDto
): AgendaEventType => {
  return new AgendaEventType(
    agendaEventType.id,
    agendaEventType.name,
    agendaEventType.color,
    agendaEventType.isAutomaticallyEveryWeek,
    agendaEventType.isAutomaticallyEveryMonth,
    agendaEventType.isAutomaticallyEveryYear,
  );
};

export const mapFromAgendaEventTypeToAgendaEventTypeDtos = (
  agendaEventTypes: AgendaEventType[]
): AgendaEventTypeDto[] => {
  return agendaEventTypes.map((agendaEventType) =>
    mapFromAgendaEventTypeToAgendaEventTypeDto(agendaEventType)
  );
};
