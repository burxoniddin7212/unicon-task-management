import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Max, Min } from 'class-validator';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

export class QueryPagination {
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ description: 'Page', example: 1 })
  page: number = DEFAULT_PAGE;

  @Min(1)
  @Max(100)
  @Type(() => Number)
  @ApiProperty({ description: 'Limit', example: 20 })
  limit: number = DEFAULT_LIMIT;
}

export const getPagination = (page: number, limit: number): number => {
  return (page - 1) * limit;
};
