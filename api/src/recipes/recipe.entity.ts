import { FileData } from 'src/files/file-data.entity';
import { Group } from 'src/groups/group.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  type: RecipeType;

  @OneToOne(() => FileData, (fileData) => fileData.recipe)
  @JoinColumn()
  fileData: Relation<FileData>;

  @ManyToOne(() => User, (user) => user.recipes)
  user: Relation<User>;

  @ManyToMany(() => Group, (group) => group.recipes)
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

  constructor(partial: Partial<Recipe>) {
    Object.assign(this, partial);
  }
}

export type RecipeType = 'starter' | 'main' | 'dessert' | 'drink' | 'other';
