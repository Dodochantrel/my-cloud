import { EventData } from 'src/events/event-data.entity';
import { Recipe } from 'src/recipes/recipe.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.groups)
  users: Relation<User[]>;

  @ManyToMany(() => Recipe, (recipe) => recipe.groups)
  recipes: Relation<Recipe[]>;

  @ManyToMany(() => EventData, (eventData) => eventData.groups)
  eventsData: Relation<EventData[]>;

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

  constructor(partial: Partial<Group>) {
    Object.assign(this, partial);
  }
}
