import { AgendaEventCategory } from "../class/agenda-event-category";

export interface AgendaEventCategoryDto {
  id: string;
  name: string;
  color: string;
  isAutomaticallyEveryWeek: boolean;
  isAutomaticallyEveryMonth: boolean;
  isAutomaticallyEveryYear: boolean;
}

export const mapFromAgendaEventCategoryDtoToAgendaEventCategory = (
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

export const mapFromAgendaEventCategoriesDtosToAgendaEventCategories = (
  agendaEventCategories: AgendaEventCategory[]
): AgendaEventCategoryDto[] => {
  return agendaEventCategories.map((agendaEventCategory) =>
    mapFromAgendaEventCategoryDtoToAgendaEventCategory(agendaEventCategory)
  );
};
