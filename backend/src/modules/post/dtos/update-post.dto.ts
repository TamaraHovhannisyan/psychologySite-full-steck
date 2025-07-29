import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    description: 'Updated title of the post',
    maxLength: 255,
  })
  title?: string;

  @ApiPropertyOptional({ description: 'Updated description of the post' })
  description?: string;
}
