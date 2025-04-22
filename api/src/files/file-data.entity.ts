import { Recipe } from 'src/recipes/recipe.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @OneToOne(() => Recipe, (recipe) => recipe.fileData)
  recipe: Recipe;

  constructor(partial: Partial<FileData>) {
    Object.assign(this, partial);
  }
}
