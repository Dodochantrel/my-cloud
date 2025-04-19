import { ApiProperty } from '@nestjs/swagger';
import { PageQuery } from './page-query';

export class PageMeta {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(pageQuery: PageQuery, totalCount: number) {
    this.limit = pageQuery.limit;
    this.page = pageQuery.page;
    this.hasPreviousPage = this.page > 1;
    this.itemCount = totalCount;
    this.pageCount = Math.ceil(totalCount / this.limit);
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PaginatedResponse<T> {
  data: T[] = [];
  @ApiProperty()
  meta: PageMeta;

  constructor(data: T[], pageQuery: PageQuery, totalCount: number) {
    this.data = data;
    this.meta = new PageMeta(pageQuery, totalCount);
  }
}
