import { Group } from 'src/groups/group.entity';
import { Recipe } from 'src/recipes/recipe.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAuthorized: boolean;

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

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Relation<Group[]>;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Relation<Recipe[]>;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  filesData: Relation<Recipe[]>;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
