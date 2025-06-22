import { EventData } from 'src/events/event-data.entity';
import { PicturesCategory } from 'src/pictures-categories/pictures-category.entity';
import { Recipe } from 'src/recipes/recipe.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
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
  @JoinTable()
  users: Relation<User[]>;

  @ManyToMany(() => Recipe, (recipe) => recipe.groups)
  @JoinTable()
  recipes: Relation<Recipe[]>;

  @ManyToMany(() => EventData, (eventData) => eventData.groups)
  eventsData: Relation<EventData[]>;

  @ManyToMany(
    () => PicturesCategory,
    (picturesCategory) => picturesCategory.groups,
  )
  @JoinTable()
  picturesCategories: Relation<PicturesCategory[]>;

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
