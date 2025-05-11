import { EventData } from '../event-data.entity';
import { RecurringEventStrategy } from './recurring-event-strategy.interface';

export class YearlyRecurringEventStrategy implements RecurringEventStrategy {
  supports(event: EventData): boolean {
    return event.isEveryYear;
  }

  generate(event: EventData, from: Date, to: Date): EventData[] {
    const events: EventData[] = [];
    const fromYear = from.getFullYear();
    const toYear = to.getFullYear();

    for (let year = fromYear; year <= toYear; year++) {
      const newStart = new Date(event.startDate);
      const newEnd = new Date(event.endDate);
      newStart.setFullYear(year);
      newEnd.setFullYear(year);

      if (newEnd >= from && newStart <= to) {
        events.push({ ...event, startDate: newStart, endDate: newEnd });
      }
    }

    return events;
  }
}
