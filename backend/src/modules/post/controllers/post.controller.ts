import {
  Body,
  Controller,
  Get,
  Post as PostMethod,
  Patch,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { QueryPostsDto } from '../dtos/query-posts.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

const validateImageFile = (file: Express.Multer.File): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  const maxSize = Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024); // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException(
      'Only image files (JPEG, PNG, WebP, GIF) are allowed',
    );
  }

  if (file.size > maxSize) {
    throw new BadRequestException(
      `File size must be less than ${maxSize / (1024 * 1024)}MB`,
    );
  }

  return true;
};

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get published posts' })
  list(@Query() query: QueryPostsDto) {
    return this.service.list(query);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get post by slug' })
  bySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  byId(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.service.findById(id);
  }
}

@ApiTags('Admin - Posts')
@UseGuards(JwtAuthGuard)
@Controller('admin/posts')
export class AdminPostController {
  constructor(private readonly service: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts (admin)' })
  adminList(@Query() query: QueryPostsDto) {
    return this.service.adminList(query);
  }

  @PostMethod()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new post' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
          cb(null, join(process.cwd(), uploadsDir));
        },
        filename: (_req, file, cb) => {
          const base = file.originalname.replace(/\.[^/.]+$/, '');
          const safe = base
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, '-')
            .replace(/^-+|-+$/g, '');
          const unique = `${Date.now()}-${randomUUID().slice(0, 8)}`;
          const extension = extname(file.originalname);
          cb(null, `${unique}-${safe}${extension}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        try {
          const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
          ];
          const isValid = allowedTypes.includes(file.mimetype);

          if (!isValid) {
            cb(
              new BadRequestException(
                'Only image files (JPEG, PNG, WebP, GIF) are allowed',
              ),
              false,
            );
            return;
          }

          cb(null, true);
        } catch (error) {
          cb(error, false);
        }
      },
      limits: {
        fileSize: Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024), // 5MB
        files: 1,
      },
    }),
  )
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        validateImageFile(file);

        const basePath = process.env.UPLOADS_PUBLIC_PATH || '/uploads';
        const imageUrl = `${basePath}/${file.filename}`;
        const createData = {
          ...dto,
          image: imageUrl,
        };

        return await this.service.create(createData);
      }

      return await this.service.create(dto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create post');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
          cb(null, join(process.cwd(), uploadsDir));
        },
        filename: (_req, file, cb) => {
          const base = file.originalname.replace(/\.[^/.]+$/, '');
          const safe = base
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, '-')
            .replace(/^-+|-+$/g, '');
          const unique = `${Date.now()}-${randomUUID().slice(0, 8)}`;
          const extension = extname(file.originalname);
          cb(null, `${unique}-${safe}${extension}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        try {
          const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
          ];
          const isValid = allowedTypes.includes(file.mimetype);

          if (!isValid) {
            cb(
              new BadRequestException(
                'Only image files (JPEG, PNG, WebP, GIF) are allowed',
              ),
              false,
            );
            return;
          }

          cb(null, true);
        } catch (error) {
          cb(error, false);
        }
      },
      limits: {
        fileSize: Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024), // 5MB
        files: 1,
      },
    }),
  )
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        validateImageFile(file);

        const basePath = process.env.UPLOADS_PUBLIC_PATH || '/uploads';
        const imageUrl = `${basePath}/${file.filename}`;
        const updateData = {
          ...dto,
          image: imageUrl,
        };

        return await this.service.update(id, updateData);
      }

      return await this.service.update(id, dto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update post');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete post' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.service.remove(id);
  }
}
