import { PaginatedMeta } from './paginated-meta';

export class Paginated<t> {
  data: t[];
  paginatedMeta: PaginatedMeta;

  constructor(data: t[], paginatedMeta: PaginatedMeta) {
    this.data = data;
    this.paginatedMeta = paginatedMeta;
  }
}
