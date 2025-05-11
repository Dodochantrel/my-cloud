import { EventData } from '../event-data.entity';

export interface RecurringEventStrategy {
  supports(event: EventData): boolean;
  generate(event: EventData, from: Date, to: Date): EventData[];
}
