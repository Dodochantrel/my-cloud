export class TastingCategory {
  id: number;
  name: string;
  icon: string | null;
  color: string;
  childrens: TastingCategory[];

  constructor(id: number, name: string, icon: string | null, color: string, childrens: TastingCategory[]) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.childrens = childrens;
  }
}
