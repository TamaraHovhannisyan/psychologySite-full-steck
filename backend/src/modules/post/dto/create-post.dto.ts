import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum PostCategory {
  ARTICLE = 'article',
  SELF_DEVELOPMENT = 'self-development',
  PSYCHOLOGY = 'psychology',
}

export class CreatePostDto {
  @ApiProperty({
    example: 'The Power of Focus in Modern Life',
    description: 'Title of the post — between 10 and 100 characters',
    minLength: 10,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(10, { message: 'Title must be at least 10 characters long' })
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @ApiProperty({
    example:
      'Concentration is a skill you can train. This article explains how to regain focus in a distracted world...',
    description: 'Main content of the post',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiProperty({
    example: 'psychology',
    enum: PostCategory,
    description:
      'Category of the post (article, self-development, or psychology)',
  })
  @IsEnum(PostCategory, {
    message:
      'Category must be one of the following: article, self-development, psychology',
  })
  category: PostCategory;

  @ApiProperty({
    example: '2025-10-19T12:00:00Z',
    required: false,
    description: 'Creation date (optional — usually set by backend)',
  })
  @IsOptional()
  createDate?: Date;
}
