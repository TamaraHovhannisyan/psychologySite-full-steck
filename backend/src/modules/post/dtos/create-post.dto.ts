import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PostCategory } from '../entities/post.entity';

const toTrim = (v: unknown) => (typeof v === 'string' ? v.trim() : v);
const toSingleSpaced = (v: unknown) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : v;
const toLower = (v: unknown) => (typeof v === 'string' ? v.toLowerCase() : v);
const toBoolean = (v: unknown) => {
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase();
  return s === 'true' || s === '1' || s === 'on' || s === 'yes';
};

export class CreatePostDto {
  @IsString()
  @Length(2, 200)
  @Transform(({ value }) => toSingleSpaced(value))
  title!: string;

  @IsOptional()
  @IsString()
  @Length(1, 220)
  @Matches(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u, {
    message: 'slug must be kebab-case: letters/numbers and hyphens',
  })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim().toLowerCase();
    return v === '' ? undefined : v;
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  @Transform(({ value }) => toTrim(value))
  content?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => toTrim(value))
  image?: string;

  @IsEnum(PostCategory)
  @Transform(({ value }) => toLower(value))
  category!: PostCategory;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === undefined ? true : toBoolean(value)))
  published?: boolean = true;
}
