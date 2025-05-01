import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { EventDataType } from './event-data-type.entity';
import { Group } from 'src/groups/group.entity';

@Entity()
export class EventData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  everyYear: boolean;

  @ManyToOne(() => EventDataType, (eventDataType) => eventDataType.eventData)
  eventDataType: Relation<EventDataType>;

  @ManyToMany(() => Group, (group) => group.eventsData)
  groups: Relation<Group[]>;

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

  constructor(partial: Partial<EventData>) {
    Object.assign(this, partial);
  }
}
