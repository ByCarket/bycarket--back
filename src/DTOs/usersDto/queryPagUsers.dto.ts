import { Transform, Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class QueryPagUsersDto {
  @Transform(({ value }) => value ?? 1)
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @Transform(({ value }) => value ?? 10)
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
