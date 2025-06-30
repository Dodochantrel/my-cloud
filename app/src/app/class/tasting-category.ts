export class TastingCategory {
  id: number;
  name: string;
  childrens: TastingCategory[];

  constructor(id: number, name: string, childrens: TastingCategory[]) {
    this.id = id;
    this.name = name;
    this.childrens = childrens;
  }
}
