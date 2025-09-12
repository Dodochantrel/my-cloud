export class TastingCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string;
  childrens: TastingCategory[];

  constructor(id: string, name: string, icon: string | null, color: string, childrens: TastingCategory[]) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.childrens = childrens;
  }
}
