import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PostCategory } from '../entities/post.entity';

const toLower = (v: unknown) => (typeof v === 'string' ? v.toLowerCase() : v);
const normalizeQ = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const s = v.replace(/\s+/g, ' ').trim();
  return s === '' ? undefined : s;
};

export class QueryPostsDto {
  @IsOptional()
  @IsEnum(PostCategory)
  @Transform(({ value }) => toLower(value))
  category?: PostCategory;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }) => normalizeQ(value))
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
