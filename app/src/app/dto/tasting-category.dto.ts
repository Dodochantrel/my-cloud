import { TastingCategory } from '../class/tasting-category';

export interface TastingCategoryDto {
  id: string;
  name: string;
  icon: string | null;
  color: string;
  childrens?: TastingCategoryDto[];
}

export function mapFromDtoToTastingCategory(
  dto: TastingCategoryDto
): TastingCategory {
  return new TastingCategory(dto.id, dto.name, dto.icon, dto.color, dto.childrens ? dto.childrens.map(mapFromDtoToTastingCategory) : []);
}

export function mapFromDtosToTastingCategories(
  dtos: TastingCategoryDto[]
): TastingCategory[] {
  return dtos.map(mapFromDtoToTastingCategory);
}
