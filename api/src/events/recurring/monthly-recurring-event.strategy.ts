import { EventData } from '../event-data.entity';
import { RecurringEventStrategy } from './recurring-event-strategy.interface';

export class MonthlyRecurringEventStrategy implements RecurringEventStrategy {
  supports(event: EventData): boolean {
    return event.isEveryMonth;
  }

  generate(event: EventData, from: Date, to: Date): EventData[] {
    const events: EventData[] = [];
    const current = new Date(from);

    while (current <= to) {
      const newStart = new Date(event.startDate);
      const newEnd = new Date(event.endDate);

      newStart.setFullYear(current.getFullYear());
      newStart.setMonth(current.getMonth());

      newEnd.setFullYear(current.getFullYear());
      newEnd.setMonth(current.getMonth());

      if (newEnd >= from && newStart <= to) {
        events.push({ ...event, startDate: newStart, endDate: newEnd });
      }

      current.setMonth(current.getMonth() + 1);
    }

    return events;
  }
}
