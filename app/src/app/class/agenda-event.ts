import { AgendaEventType } from "./agenda-event-type";

export class AgendaEvent {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: AgendaEventType | null;

  constructor(
    id: number,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    type: AgendaEventType | null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.type = type;
  }
}

