import { Tasting } from "../class/tasting";

export interface TastingDto {
  id: number;
  name: string;
  rating: number;
  description: string;
}

export const mapFromDtoToTasting = (dto: TastingDto): Tasting => {
  return new Tasting(dto.id, dto.name, dto.rating, dto.description);
}

export const mapFromDtosToTastings = (dtos: TastingDto[]): Tasting[] => {
  return dtos.map((dto: TastingDto) => mapFromDtoToTasting(dto));
}