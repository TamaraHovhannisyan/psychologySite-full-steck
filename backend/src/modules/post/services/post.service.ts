import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { promises as fs } from 'node:fs';
import { join, basename } from 'node:path';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { QueryPostsDto } from '../dtos/query-posts.dto';
import { slugify } from '../utils/slugify';

const PG_UNIQUE_VIOLATION = '23505' as const;

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {}

  private async makeUniqueSlug(
    baseText: string,
    excludeId?: string,
  ): Promise<string> {
    const root = slugify(baseText) || 'post';
    let candidate = root;
    let i = 2;

    while (true) {
      const where: any = { slug: candidate };
      if (excludeId) where.id = Not(excludeId);

      const exists = await this.repo.findOne({ where });
      if (!exists) return candidate;

      candidate = `${root}-${i++}`;
    }
  }

  private async deleteOldImage(imagePath: string): Promise<void> {
    try {
      if (!imagePath?.startsWith('/uploads/')) return;

      const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
      const filename = basename(imagePath);
      const fullPath = join(process.cwd(), uploadsDir, filename);

      await fs.access(fullPath);
      await fs.unlink(fullPath);
      this.logger.log(`Deleted old image: ${filename}`);
    } catch (error) {
      this.logger.warn(`Could not delete image ${imagePath}: ${error.message}`);
    }
  }

  private validateImagePath(imagePath: string): boolean {
    return /^(https?:\/\/[^\s]+|\/uploads\/[A-Za-z0-9._\-\/]+)$/i.test(
      imagePath,
    );
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const desired = (dto.slug ?? dto.title).trim();
    const slug = await this.makeUniqueSlug(desired);

    const payload: Partial<Post> = {
      title: dto.title,
      slug,
      content: dto.content?.trim() ? dto.content : null,
      category: dto.category,
      published: dto.published ?? true,
    };

    if (typeof dto.image === 'string' && dto.image.trim()) {
      const imagePath = dto.image.trim();
      if (this.validateImagePath(imagePath)) {
        payload.image = imagePath;
      } else {
        throw new ConflictException('Invalid image path format');
      }
    }

    const entity = this.repo.create(payload);

    try {
      const savedPost = await this.repo.save(entity);
      this.logger.log(`Created post: ${savedPost.id} - ${savedPost.title}`);
      return savedPost;
    } catch (e: any) {
      if (e?.code === PG_UNIQUE_VIOLATION) {
        entity.slug = await this.makeUniqueSlug(desired);
        try {
          const savedPost = await this.repo.save(entity);
          this.logger.log(
            `Created post with retry: ${savedPost.id} - ${savedPost.title}`,
          );
          return savedPost;
        } catch (e2: any) {
          if (e2?.code === PG_UNIQUE_VIOLATION) {
            throw new ConflictException('Slug already exists');
          }
          this.logger.error('Failed to create post on retry', e2);
          throw new InternalServerErrorException('Failed to create post');
        }
      }
      this.logger.error('Failed to create post', e);
      throw e;
    }
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    const oldImagePath = post.image;

    if (typeof dto.title === 'string' || typeof dto.slug === 'string') {
      const base = (dto.slug ?? dto.title ?? post.title).trim();
      post.slug = await this.makeUniqueSlug(base, id);
    }

    if (typeof dto.title === 'string') post.title = dto.title;
    if (typeof dto.content === 'string') {
      const c = dto.content.trim();
      post.content = c ? c : null;
    }
    if (typeof dto.category === 'string') {
      post.category = dto.category as any;
    }
    if (typeof dto.published === 'boolean') post.published = dto.published;

    if ('image' in dto) {
      const imageValue = (dto as any).image;

      if (
        imageValue === null ||
        (typeof imageValue === 'string' && imageValue.trim() === '')
      ) {
        post.image = null;
        if (oldImagePath) {
          await this.deleteOldImage(oldImagePath);
        }
      } else if (typeof imageValue === 'string') {
        const imagePath = imageValue.trim();
        if (this.validateImagePath(imagePath)) {
          post.image = imagePath;
          if (oldImagePath && oldImagePath !== imagePath) {
            await this.deleteOldImage(oldImagePath);
          }
        } else {
          throw new ConflictException('Invalid image path format');
        }
      }
    }

    try {
      const savedPost = await this.repo.save(post);
      this.logger.log(`Updated post: ${savedPost.id} - ${savedPost.title}`);
      return savedPost;
    } catch (e: any) {
      if (e?.code === PG_UNIQUE_VIOLATION) {
        const base = (dto.slug ?? dto.title ?? post.title).trim();
        post.slug = await this.makeUniqueSlug(base, id);
        try {
          const savedPost = await this.repo.save(post);
          this.logger.log(
            `Updated post with retry: ${savedPost.id} - ${savedPost.title}`,
          );
          return savedPost;
        } catch (e2: any) {
          if (e2?.code === PG_UNIQUE_VIOLATION) {
            throw new ConflictException('Slug already exists');
          }
          this.logger.error('Failed to update post on retry', e2);
          throw new InternalServerErrorException('Failed to update post');
        }
      }
      this.logger.error('Failed to update post', e);
      throw e;
    }
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    if (post.image) {
      await this.deleteOldImage(post.image);
    }

    await this.repo.remove(post);
    this.logger.log(`Deleted post: ${id} - ${post.title}`);

    return { success: true };
  }

  async findById(id: string): Promise<Post> {
    const post = await this.repo.findOne({
      where: { id, published: true },
      select: [
        'id',
        'title',
        'slug',
        'image',
        'category',
        'content',
        'createdAt',
      ],
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.repo.findOne({
      where: { slug, published: true },
      select: [
        'id',
        'title',
        'slug',
        'image',
        'category',
        'content',
        'createdAt',
      ],
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async list(query: QueryPostsDto) {
    const { page = 1, limit = 10, category, q } = query;

    const whereBase: any = { published: true };
    if (category) whereBase.category = category;

    const whereArr: any[] = [];
    if (q) {
      whereArr.push({ ...whereBase, title: ILike(`%${q}%`) });
      whereArr.push({ ...whereBase, content: ILike(`%${q}%`) });
    }

    const [items, total] = await this.repo.findAndCount({
      where: whereArr.length ? whereArr : whereBase,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'title', 'slug', 'image', 'category', 'createdAt'],
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async adminList(query: QueryPostsDto) {
    const { page = 1, limit = 10, category, q } = query;

    const whereBase: any = {};
    if (category) whereBase.category = category;

    const whereArr: any[] = [];
    if (q) {
      whereArr.push({ ...whereBase, title: ILike(`%${q}%`) });
      whereArr.push({ ...whereBase, content: ILike(`%${q}%`) });
    }

    const [items, total] = await this.repo.findAndCount({
      where: whereArr.length ? whereArr : whereBase,
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
