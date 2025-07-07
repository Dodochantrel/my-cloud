import { TastingCategory } from "./tasting-category";

export class Tasting {
    id: number;
    name: string;
    rating: number;
    description: string;
    fileBlobUrl: string | null = null;
    category: TastingCategory | null = null;

    constructor(id: number, name: string, rating: number, description: string) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.description = description;
    }
}

export const defaultTasting = new Tasting(0, '', 0, '');