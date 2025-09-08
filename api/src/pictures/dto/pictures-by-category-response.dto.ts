import { ApiProperty } from '@nestjs/swagger';

export class PictureByCategoryResponseDto {
  @ApiProperty({
    description: 'Array of picture IDs in the category',
    example: ['1', '2', '3'],
  })
  ids: string[];

  @ApiProperty({
    description: 'Total number of pictures in the category',
    example: 3,
  })
  count: number;

  constructor(ids: string[], count: number) {
    this.ids = ids;
    this.count = count;
  }
}
