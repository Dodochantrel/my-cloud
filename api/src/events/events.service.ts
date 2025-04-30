import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventData } from './event-data.entity';
import { EventDataType } from './event-data-type.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventData)
    private userRepository: Repository<EventData>,
    @InjectRepository(EventDataType)
    private userRepositoryType: Repository<EventDataType>,
  ) {}

  async findAll(
    search: string,
    from: Date | null,
    to: Date | null,
  ): Promise<EventData[]> {
    const query = this.userRepository.createQueryBuilder('eventData');
    if (search) {
      query.andWhere('eventData.name LIKE :search', { search: `%${search}%` });
    }
    if (from) query.andWhere('eventData.createdAt >= :from', { from });
    if (to) query.andWhere('eventData.createdAt <= :to', { to });
    return await query.getMany();
  }

  async save(eventData: EventData): Promise<EventData> {
    return await this.userRepository.save(eventData);
  }
}
