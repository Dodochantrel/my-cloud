import { Picture } from './picture';

export class PictureCategory {
  id: number;
  name: string;
  childrens: PictureCategory[];
  pictures: Picture[];

  constructor(id: number, name: string, childrens: PictureCategory[] = []) {
    this.id = id;
    this.name = name;
    this.childrens = childrens;
    this.pictures = [];
  }
}
