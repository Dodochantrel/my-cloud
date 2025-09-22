import { Options } from "../tools/option.interface";
import { Group } from "./group";

export class Recipe {
  id: number;
  name: string;
  description: string;
  type: RecipeType;
  createdAt: Date;
  updatedAt: Date;
  fileBlobUrl: string | null = null;
  groups: Group[] = [];

  constructor(
    id: number,
    name: string,
    description: string,
    type: RecipeType,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static options: Options[] = [
    { label: 'Entrée', value: 'starter' },
    { label: 'Plat', value: 'main' },
    { label: 'Dessert', value: 'dessert' },
    { label: 'Boisson', value: 'drink' },
    { label: 'Autre', value: 'other' },
  ];
}

export type RecipeType = 'starter' | 'main' | 'dessert' | 'drink' | 'other';
