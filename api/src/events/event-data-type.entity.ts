import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventData } from './event-data.entity';

@Entity()
export class EventDataType {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => EventData, (eventData) => eventData.eventDataType)
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

  constructor(partial: Partial<EventDataType>) {
    Object.assign(this, partial);
  }
}
