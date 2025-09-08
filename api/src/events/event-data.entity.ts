import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { EventDataType } from './event-data-type.entity';
import { Group } from 'src/groups/group.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class EventData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string | null;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: false })
  isEveryYear: boolean;

  @Column({ default: false })
  isEveryMonth: boolean;

  @Column({ default: false })
  isEveryWeek: boolean;

  @ManyToOne(() => EventDataType, (eventDataType) => eventDataType.eventData)
  eventDataType: Relation<EventDataType>;

  @ManyToMany(() => Group, (group) => group.eventsData)
  @JoinTable()
  groups: Relation<Group[]>;

  @ManyToOne(() => User, (user) => user.eventsData)
  user: Relation<User>;

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
