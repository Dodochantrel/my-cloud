import { ApiProperty } from '@nestjs/swagger';

export class PictureRequestDto {
  @ApiProperty({
    description: 'Array of category IDs to which the picture belongs',
    example: [1, 2, 3],
  })
  categoriesId: number[];
}
