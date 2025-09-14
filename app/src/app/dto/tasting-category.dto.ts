import { TastingCategory } from '../class/tasting-category';

export interface TastingCategoryDto {
  id: string;
  name: string;
  icon: string | null;
  color: string;
  childrens?: TastingCategoryDto[];
}

export function mapFromDtoToTastingCategory(
  dto: TastingCategoryDto,
  parent: TastingCategory | null = null
): TastingCategory {
  const category = new TastingCategory(dto.id, dto.name, dto.icon, dto.color);
  category.parent = parent;
  category.childrens = dto.childrens ? dto.childrens.map(child => mapFromDtoToTastingCategory(child, category)) : []
  return category;
}

export function mapFromDtosToTastingCategories(
  dtos: TastingCategoryDto[]
): TastingCategory[] {
  return dtos.map(dto => mapFromDtoToTastingCategory(dto));
}
