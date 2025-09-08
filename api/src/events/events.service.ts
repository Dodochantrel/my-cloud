import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventData } from './event-data.entity';
import { RecurringEventProcessor } from './recurring/recurring-event-processor.service';
import { EventDataType } from './event-data-type.entity';
import { GroupsService } from 'src/groups/groups.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventData)
    private eventDataRepository: Repository<EventData>,
    @InjectRepository(EventDataType)
    private eventDataTypeRepository: Repository<EventDataType>,
    private recurringProcessor: RecurringEventProcessor,
    private readonly groupsService: GroupsService,
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

    return events;
  }

  async save(eventData: EventData): Promise<EventData[]> {
    if (eventData.groups && eventData.groups.length > 0) {
      for (const group of eventData.groups) {
        await this.groupsService.hasUserInGroup(group.id, eventData.user.id);
      }
    }
    const event = await this.eventDataRepository.save(eventData);
    return await this.recurringProcessor.process(
      [event],
      event.startDate,
      event.endDate,
    );
  }

  async update(userId: string, eventData: EventData): Promise<EventData[]> {
    const event = await this.eventDataRepository.findOne({
      where: { id: eventData.id },
      relations: ['groups.users', 'user'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Vérifier si l'utilisateur a les droits :
    const isOwner = event.user?.id === userId;
    const isInGroup = event.groups?.some((group) =>
      group.users?.some((user) => user.id === userId),
    );

    if (!isOwner && !isInGroup) {
      throw new UnauthorizedException('You are not allowed to edit this event');
    }

    // Mettre à jour l'événement
    return await this.recurringProcessor.process(
      [await this.eventDataRepository.save(eventData)],
      event.startDate,
      event.endDate,
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    const event = await this.eventDataRepository.findOne({
      where: { id },
      relations: ['groups', 'user'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Vérifier si l'utilisateur a les droits :
    const isOwner = event.user?.id === userId;
    const isInGroup = event.groups?.some((group) =>
      group.users?.some((user) => user.id === userId),
    );

    if (!isOwner && !isInGroup) {
      throw new UnauthorizedException('You are not allowed to edit this event');
    }

    await this.eventDataRepository.remove(event);
  }

  async findAllTypes(): Promise<EventDataType[]> {
    return await this.eventDataTypeRepository.find();
  }
}
