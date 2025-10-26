import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostCategory } from './dto/create-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new post (with optional image)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Post creation data (multipart/form-data)',
    type: CreatePostDto,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'The Power of Focus in Modern Life' },
        content: {
          type: 'string',
          example:
            'Concentration is a skill you can train. This article explains how...',
        },
        category: {
          type: 'string',
          enum: Object.values(PostCategory),
          example: 'psychology',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Optional image file',
        },
      },
      required: ['title', 'content', 'category'],
    },
  })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          callback(null, `image-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.create(createPostDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts or filter by category',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter posts by category (optional)',
    enum: Object.values(PostCategory),
  })
  @ApiResponse({
    status: 200,
    description: 'List of posts returned successfully',
  })
  async findAll(@Query('category') category?: string) {
    if (category) return this.postService.findByCategory(category);
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Post found successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a post (title/content/category/image)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'ID of the post to update',
    example: 2,
  })
  @ApiBody({
    description: 'Post update data (multipart/form-data)',
    type: UpdatePostDto,
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Updated Title — The Power of Deep Work',
        },
        content: {
          type: 'string',
          example: 'Updated post content goes here...',
        },
        category: {
          type: 'string',
          enum: Object.values(PostCategory),
          example: 'selfgrowth',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Optional new image file',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid post ID or data' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          callback(null, `image-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.update(+id, updatePostDto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the post to delete',
    example: 3,
  })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
