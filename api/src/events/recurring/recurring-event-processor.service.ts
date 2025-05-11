import { Injectable } from '@nestjs/common';
import { RecurringEventStrategy } from './recurring-event-strategy.interface';
import { YearlyRecurringEventStrategy } from './yearly-recurring-event.strategy';
import { EventData } from '../event-data.entity';
import { MonthlyRecurringEventStrategy } from './monthly-recurring-event.strategy';
import { WeeklyRecurringEventStrategy } from './weekly-recurring-event.strategy';

@Injectable()
export class RecurringEventProcessor {
  private strategies: RecurringEventStrategy[] = [
    new YearlyRecurringEventStrategy(),
    new MonthlyRecurringEventStrategy(),
    new WeeklyRecurringEventStrategy(),
  ];

  process(events: EventData[], from: Date, to: Date): EventData[] {
    const result: EventData[] = [];

    for (const event of events) {
      const strategy = this.strategies.find((s) => s.supports(event));
      if (strategy) {
        result.push(...strategy.generate(event, from, to));
      } else {
        result.push(event);
      }
    }

    return result;
  }
}
