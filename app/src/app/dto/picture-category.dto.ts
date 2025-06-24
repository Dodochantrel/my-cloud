import { PictureCategory } from "../class/picture-category";
import { GroupDto } from "./group.dto";

export interface PictureCategoryDto {
  id: number;
  name: string;
  childrens: PictureCategoryDto[];
  groups?: GroupDto[];
}

export const  mapFromPictureCategoryDto = (dto: PictureCategoryDto, parent: PictureCategory | null = null): PictureCategory => {
  const category = new PictureCategory(dto.id, dto.name, dto.childrens ? dto.childrens.map(child => mapFromPictureCategoryDto(child, new PictureCategory(dto.id, dto.name))) : []);
  category.pictures = [];
  if (dto.groups) {
    category.groupsId = dto.groups.map(group => group.id);
  }
  category.parent = parent;
  return category;
}

export const mapFromPictureCategoriesDto = (dtos: PictureCategoryDto[]): PictureCategory[] => {
  return dtos.map(dto => mapFromPictureCategoryDto(dto));
}