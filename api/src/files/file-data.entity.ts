import { Picture } from 'src/pictures/picture.entity';
import { Recipe } from 'src/recipes/recipe.entity';
import { Tasting } from 'src/tastings/tasting.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class FileData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @OneToOne(() => Recipe, (recipe) => recipe.fileData)
  recipe: Relation<Recipe>;

  @ManyToOne(() => User, (user) => user.filesData)
  user: Relation<User>;

  @OneToOne(() => Picture, (picture) => picture.fileData)
  picture: Relation<Picture>;

  @OneToOne(() => Tasting, (tasting) => tasting.fileData)
  tasting: Relation<Tasting>;

  constructor(partial: Partial<FileData>) {
    Object.assign(this, partial);
  }

  prepareFileName() {
    this.name = `${new Date().getTime()}`;
  }
}
