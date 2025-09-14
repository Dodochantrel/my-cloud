export class TastingCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string;
  parent: TastingCategory | null = null;
  childrens: TastingCategory[] = [];

  constructor(id: string, name: string, icon: string | null, color: string) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.color = color;
  }
}
