import { Group } from 'src/groups/group.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class PicturesCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeParent()
  parent: Relation<PicturesCategory>;

  @TreeChildren()
  childrens: Relation<PicturesCategory[]>;

  @ManyToMany(() => Group, (group) => group.picturesCategories, {
    cascade: true,
  })
  groups: Relation<Group[]>;

  @ManyToOne(() => User, (user) => user.picturesCategories)
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

  constructor(partial: Partial<PicturesCategory> = {}) {
    Object.assign(this, partial);
  }
}
