import { Recipe } from "../class/recipe";

export interface RecipeDto {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export const mapFromDtoToRecipe = (dto: RecipeDto): Recipe => {
  return new Recipe(
    dto.id,
    dto.name,
    dto.description,
    dto.type,
    new Date(dto.createdAt),
    new Date(dto.updatedAt)
  );
}

export const mapFromDtosToRecipes = (dtos: RecipeDto[]): Recipe[] => {
  return dtos.map((dto) => mapFromDtoToRecipe(dto));
}
