import { AgendaEventCategory } from "./agenda-event-category";

export class AgendaEvent {
  id: number;
  name: string;
  description: string;
  startDatetime: Date;
  endDatetime: Date;
  isEveryYear: boolean = false;
  isEveryMonth: boolean = false
  isEveryWeek: boolean = false;
  category: AgendaEventCategory | null;

  constructor(
    id: number,
    name: string,
    description: string,
    startDatetime: Date,
    endDatetime: Date,
    category: AgendaEventCategory | null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDatetime = startDatetime;
    this.endDatetime = endDatetime;
    this.category = category;
  }
}

export const defaultAgendaEvent = new AgendaEvent(
  0,
  "",
  "",
  new Date(),
  new Date(),
  null
);

