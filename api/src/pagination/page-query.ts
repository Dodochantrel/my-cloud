import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PageQuery {
  public static readonly DEFAULT_LIMIT = 100;
  public static readonly DEFAULT_PAGE = 1;

  @ApiPropertyOptional({
    minimum: 1,
    default: PageQuery.DEFAULT_PAGE,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    toNumber(value, { default: PageQuery.DEFAULT_PAGE, min: 1 }),
  )
  public page: number = PageQuery.DEFAULT_PAGE;

  @ApiPropertyOptional({
    minimum: 1,
    default: PageQuery.DEFAULT_LIMIT,
    type: Number,
  })
  @Transform(({ value }) =>
    toNumber(value, { default: PageQuery.DEFAULT_LIMIT, min: 1 }),
  )
  public limit: number = PageQuery.DEFAULT_LIMIT;

  public static of(page?: number, limit?: number): PageQuery {
    const dto = new PageQuery();
    dto.page = page ?? PageQuery.DEFAULT_PAGE;
    dto.limit = limit ?? PageQuery.DEFAULT_LIMIT;
    return dto;
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  constructor(page?: number, limit?: number) {
    this.page = page ?? PageQuery.DEFAULT_PAGE;
    this.limit = limit ?? PageQuery.DEFAULT_LIMIT;
  }
}

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
}
