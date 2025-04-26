import { Paginated } from '../class/paginated';
import { PaginatedMeta } from '../class/paginated-meta';

export interface PaginatedDto<t> {
  data: t[];
  meta: PaginatedMetaDto;
}

export interface PaginatedMetaDto {
  hasNext: boolean;
  hasPrevious: boolean;
  itemCount: number;
  pageCount: number;
  page: number;
  limit: number;
}

export const mapFromPaginatedDtoToPaginated = <T>(
  paginatedDto: PaginatedDto<T>
): Paginated<T> => {
  return new Paginated<T>(
    paginatedDto.data,
    new PaginatedMeta(
      paginatedDto.meta.hasNext,
      paginatedDto.meta.hasPrevious,
      paginatedDto.meta.itemCount,
      paginatedDto.meta.pageCount,
      paginatedDto.meta.page,
      paginatedDto.meta.limit
    )
  );
};
