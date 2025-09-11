import { ApiProperty } from "@nestjs/swagger";
import { TastingCategory } from "../tasting-category.entity";

export class TastingCategoryRequestDto {
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
    type: String,
    description: 'The color associated with the tasting category.',
  })
  color: string;

  @ApiProperty({
    type: String,
    description: 'The parent ID of the tasting category, if any.',
  })
  parentId: string | null;
}

export const mapFromRequestDtoToTastingCategory = (dto: TastingCategoryRequestDto): TastingCategory => {
    return new TastingCategory({ name: dto.name, icon: dto.icon, color: dto.color, parent: new TastingCategory({ id: dto.parentId }) });
};