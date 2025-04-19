import { ApiProperty } from '@nestjs/swagger';
import { PageQuery } from 'src/pagination/page-query';

export class QueryGetWithParamsDto extends PageQuery {
  @ApiProperty({
    description: `Search for query string`,
    required: true,
  })
  search: string;
}
