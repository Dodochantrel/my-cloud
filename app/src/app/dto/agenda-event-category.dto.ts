import { AgendaEventCategory } from "../class/agenda-event-category";

export interface AgendaEventCategoryDto {
  id: string;
  name: string;
  color: string;
  isAutomaticallyEveryWeek: boolean;
  isAutomaticallyEveryMonth: boolean;
  isAutomaticallyEveryYear: boolean;
}

export const mapFromAgendaEventCategoryToAgendaEventCategoryDto = (
  agendaEventType: AgendaEventCategoryDto
): AgendaEventCategory => {
  return new AgendaEventCategory(
    agendaEventType.id,
    agendaEventType.name,
    agendaEventType.color,
    agendaEventType.isAutomaticallyEveryWeek,
    agendaEventType.isAutomaticallyEveryMonth,
    agendaEventType.isAutomaticallyEveryYear,
  );
};

export const mapFromAgendaEventCategoryToAgendaEventCategoryDtos = (
  agendaEventCategories: AgendaEventCategory[]
): AgendaEventCategoryDto[] => {
  return agendaEventCategories.map((agendaEventCategory) =>
    mapFromAgendaEventCategoryToAgendaEventCategoryDto(agendaEventCategory)
  );
};
