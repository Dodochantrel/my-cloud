import { Recipe } from "../class/recipe";
import { GroupDto, mapFromDtosToGroups } from "./group.dto";

export interface RecipeDto {
  id: number;
  name: string;
  description: string;
  type: 'other' | 'starter' | 'main' | 'dessert' | 'drink';
  createdAt: string;
  updatedAt: string;
  groups: GroupDto[];
}

export const mapFromDtoToRecipe = (dto: RecipeDto): Recipe => {
  const recipe = new Recipe(
    dto.id,
    dto.name,
    dto.description,
    dto.type,
    new Date(dto.createdAt),
    new Date(dto.updatedAt)
  );
  recipe.groups = mapFromDtosToGroups(dto.groups);
  return recipe;
}

export const mapFromDtosToRecipes = (dtos: RecipeDto[]): Recipe[] => {
  return dtos.map((dto) => mapFromDtoToRecipe(dto));
}
