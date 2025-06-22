import { PictureCategory } from "../class/picture-category";

export interface PictureCategoryDto {
  id: number;
  name: string;
  childrens: PictureCategoryDto[];
}

export const mapFromPictureCategoryDto = (dto: PictureCategoryDto): PictureCategory => {
  const category = new PictureCategory(dto.id, dto.name, dto.childrens.map(mapFromPictureCategoryDto));
  category.pictures = [];
  return category;
}

export const mapFromPictureCategoriesDto = (dtos: PictureCategoryDto[]): PictureCategory[] => {
  return dtos.map(mapFromPictureCategoryDto);
}