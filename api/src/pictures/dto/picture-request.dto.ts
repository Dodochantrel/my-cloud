import { ApiProperty } from '@nestjs/swagger';

export class PictureRequestDto {
  @ApiProperty({
    description: 'Category IDs to which the picture belongs',
    example: 1,
  })
  categoryId: number;
}
