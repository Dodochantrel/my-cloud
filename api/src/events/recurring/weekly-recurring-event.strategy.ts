import { EventData } from '../event-data.entity';
import { RecurringEventStrategy } from './recurring-event-strategy.interface';

export class WeeklyRecurringEventStrategy implements RecurringEventStrategy {
  supports(event: EventData): boolean {
    return event.isEveryWeek;
  }

  generate(event: EventData, from: Date, to: Date): EventData[] {
    const events: EventData[] = [];
    const current = new Date(from);

    while (current <= to) {
      const baseStart = new Date(event.startDate);
      const baseEnd = new Date(event.endDate);

      const diff = current.getTime() - baseStart.getTime();
      const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));

      const newStart = new Date(baseStart);
      newStart.setDate(baseStart.getDate() + weeks * 7);
      newStart.setFullYear(current.getFullYear(), current.getMonth());

      const newEnd = new Date(baseEnd);
      newEnd.setDate(baseEnd.getDate() + weeks * 7);
      newEnd.setFullYear(current.getFullYear(), current.getMonth());

      if (newEnd >= from && newStart <= to) {
        events.push({ ...event, startDate: newStart, endDate: newEnd });
      }

      current.setDate(current.getDate() + 7);
    }

    return events;
  }
}
