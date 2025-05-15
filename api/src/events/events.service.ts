import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventData } from './event-data.entity';
import { RecurringEventProcessor } from './recurring/recurring-event-processor.service';
import { EventDataType } from './event-data-type.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventData)
    private eventDataRepository: Repository<EventData>,
    @InjectRepository(EventDataType)
    private eventDataTypeRepository: Repository<EventDataType>,
    private recurringProcessor: RecurringEventProcessor,
  ) {}

  async findAll(
    search: string,
    from: Date | null,
    to: Date | null,
  ): Promise<EventData[]> {
    const query = this.eventDataRepository.createQueryBuilder('event');

    if (from && to) {
      query.where(
        `(event.startDate BETWEEN :from AND :to OR event.endDate BETWEEN :from AND :to)`,
        { from, to },
      );
    }

    query
      .orWhere('event.isEveryYear = true')
      .orWhere('event.isEveryMonth = true')
      .orWhere('event.isEveryWeek = true');

    if (search) {
      query.andWhere(
        '(event.name ILIKE :search OR event.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Ajouter la relation avec EventDataType
    query.leftJoinAndSelect('event.eventDataType', 'eventDataType');

    const events = await query.getMany();

    if (from && to) {
      return this.recurringProcessor.process(events, from, to);
    }

    console.log('events', events);
    return events;
  }

  async save(eventData: EventData): Promise<EventData> {
    return await this.eventDataRepository.save(eventData);
  }

  async delete(id: number): Promise<void> {
    const event = await this.eventDataRepository.findOneBy({ id });

    if (!event) {
      throw new Error('Event not found');
    }

    await this.eventDataRepository.remove(event);
  }

  async findAllTypes(): Promise<EventDataType[]> {
    return await this.eventDataTypeRepository.find();
  }
}
