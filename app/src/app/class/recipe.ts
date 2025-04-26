export class Recipe {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  fileBlobUrl: string | null = null;

  constructor(
    id: number,
    name: string,
    description: string,
    type: string,
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
}
