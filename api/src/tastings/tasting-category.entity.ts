import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { Tasting } from './tasting.entity';

@Entity()
@Tree('closure-table')
export class TastingCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @OneToMany(() => Tasting, (tasting) => tasting.category)
  tastings: Tasting[];

  @TreeParent()
  parent: Relation<TastingCategory>;

  @TreeChildren()
  childrens: Relation<TastingCategory[]>;

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

  constructor(partial: Partial<TastingCategory>) {
    Object.assign(this, partial);
  }
}
