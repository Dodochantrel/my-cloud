import { FileData } from 'src/files/file-data.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { TastingCategory } from './tasting-category.entity';

@Entity()
export class Tasting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToOne(() => FileData, (fileData) => fileData.tasting)
  @JoinColumn()
  fileData: Relation<FileData>;

  @ManyToOne(() => TastingCategory, (category) => category.tastings)
  category: TastingCategory;

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

  constructor(partial: Partial<Tasting>) {
    Object.assign(this, partial);
  }
}
