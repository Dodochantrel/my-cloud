import { Picture } from './picture';

export class PictureCategory {
  id: number;
  name: string;
  parent: PictureCategory | null = null;
  childrens: PictureCategory[];
  pictures: Picture[];
  groupsId?: number[];

  constructor(id: number, name: string, childrens: PictureCategory[] = []) {
    this.id = id;
    this.name = name;
    this.childrens = childrens;
    this.pictures = [];
  }
}
