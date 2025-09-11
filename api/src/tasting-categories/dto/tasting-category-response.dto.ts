import { ApiProperty } from '@nestjs/swagger';
import { TastingCategory } from '../tasting-category.entity';

export class TastingCategoryResponseDto {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the tasting category.',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the tasting category.',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The icon associated with the tasting category.',
  })
  icon: string;

  @ApiProperty({
    type: TastingCategoryResponseDto,
    description: 'Childrens categories of the tasting category.',
  })
  childrens: TastingCategoryResponseDto[];
}

export const mapFromTastingCategory = (
  category: TastingCategory,
): TastingCategoryResponseDto => {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon,
    childrens: category.childrens
      ? category.childrens.map(mapFromTastingCategory)
      : [],
  };
};

export const mapFromTastingCategories = (
  categories: TastingCategory[],
): TastingCategoryResponseDto[] => {
  return categories.map(mapFromTastingCategory);
};
