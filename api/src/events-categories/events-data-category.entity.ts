import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventData } from '../events/event-data.entity';

@Entity()
export class EventsDataCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column({ default: false })
  isAutomaticallyEveryYear: boolean;

  @Column({ default: false })
  isAutomaticallyEveryMonth: boolean;

  @Column({ default: false })
  isAutomaticallyEveryWeek: boolean;

  @OneToMany(() => EventData, (eventData) => eventData.eventsDataCategory)
  eventData: EventData[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  constructor(partial: Partial<EventsDataCategory>) {
    Object.assign(this, partial);
  }
}
