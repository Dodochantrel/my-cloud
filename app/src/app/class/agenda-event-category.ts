export class AgendaEventCategory {
  id: string;
  name: string;
  color: string;
  isAutomaticallyEveryWeek: boolean;
  isAutomaticallyEveryMonth: boolean;
  isAutomaticallyEveryYear: boolean;

  constructor(
    id: string,
    name: string,
    color: string,
    isAutomaticallyEveryWeek: boolean,
    isAutomaticallyEveryMonth: boolean,
    isAutomaticallyEveryYear: boolean
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.isAutomaticallyEveryWeek = isAutomaticallyEveryWeek;
    this.isAutomaticallyEveryMonth = isAutomaticallyEveryMonth;
    this.isAutomaticallyEveryYear = isAutomaticallyEveryYear;
  }
}
