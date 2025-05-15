import { AgendaEventType } from "./agenda-event-type";

export class AgendaEvent {
  id: number;
  name: string;
  description: string;
  startDatetime: Date;
  endDatetime: Date;
  type: AgendaEventType | null;

  constructor(
    id: number,
    name: string,
    description: string,
    startDatetime: Date,
    endDatetime: Date,
    type: AgendaEventType | null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDatetime = startDatetime;
    this.endDatetime = endDatetime;
    this.type = type;
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
//         this.endDate.getMonth(),

