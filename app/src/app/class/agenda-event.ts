export class AgendaEvent {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: AgendaEventType;

  constructor(
    id: number,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    type: AgendaEventType
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    (this.endDate = endDate), (this.type = type);
  }
}

export class AgendaEventType {
  id: number;
  name: string;
  color: string;
  isAutomaticallyEveryYear: boolean = false;
  isAutomaticallyEveryMonth: boolean = false;
  isAutomaticallyEveryWeek: boolean = false;
  isAutomaticallyEveryDay: boolean = false;

  constructor(id: number, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }
}
