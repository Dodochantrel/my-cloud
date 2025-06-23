import { FileData } from 'src/files/file-data.entity';
import { PicturesCategory } from 'src/pictures-categories/pictures-category.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => FileData, (fileData) => fileData.pictures)
  fileData: Relation<FileData>;

  @ManyToMany(
    () => PicturesCategory,
    (picturesCategory) => picturesCategory.pictures,
  )
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

  constructor(partial: Partial<Picture>) {
    Object.assign(this, partial);
  }
}
