export class PaginatedMeta {
  hasNext: boolean;
  hasPrevious: boolean;
  itemCount: number;
  pageCount: number;
  page: number;
  limit: number;

  constructor(
    hasNext: boolean,
    hasPrevious: boolean,
    itemCount: number,
    pageCount: number,
    page: number,
    limit: number
  ) {
    this.hasNext = hasNext;
    this.hasPrevious = hasPrevious;
    this.itemCount = itemCount;
    this.pageCount = pageCount;
    this.page = page;
    this.limit = limit;
  }
}

export const defaultPaginatedMeta = new PaginatedMeta(false, false, 20, 1, 1, 20);
