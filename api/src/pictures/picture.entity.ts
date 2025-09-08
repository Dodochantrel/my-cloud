import { FileData } from 'src/files/file-data.entity';
import { PicturesCategory } from 'src/pictures-categories/pictures-category.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => FileData, (fileData) => fileData.picture)
  @JoinColumn()
  fileData: Relation<FileData>;

  @ManyToOne(
    () => PicturesCategory,
    (picturesCategory) => picturesCategory.pictures,
  )
  pictureCategory: Relation<PicturesCategory>;

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
