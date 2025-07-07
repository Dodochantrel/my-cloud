import { Tasting } from "../class/tasting";
import { mapFromDtoToTastingCategory, TastingCategoryDto } from "./tasting-category.dto";

export interface TastingDto {
  id: number;
  name: string;
  rating: number;
  description: string;
  category: TastingCategoryDto | null;
}

export const mapFromDtoToTasting = (dto: TastingDto): Tasting => {
  const tasting = new Tasting(dto.id, dto.name, dto.rating, dto.description);
  tasting.category = dto.category ? mapFromDtoToTastingCategory(dto.category) : null;
  return tasting;
}

export const mapFromDtosToTastings = (dtos: TastingDto[]): Tasting[] => {
  return dtos.map((dto: TastingDto) => mapFromDtoToTasting(dto));
}