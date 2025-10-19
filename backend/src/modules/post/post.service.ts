import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto, PostCategory } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const imageUrl = file ? `/uploads/${file.filename}` : null;

    const newPost = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      category: createPostDto.category,
      imageUrl,
    });

    return this.postRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<Post[]> {
    if (!category) {
      throw new BadRequestException('Category parameter is required');
    }

    const normalized = category.toLowerCase() as PostCategory;

    if (!Object.values(PostCategory).includes(normalized)) {
      throw new BadRequestException(
        `Invalid category. Must be one of: ${Object.values(PostCategory).join(', ')}`,
      );
    }

    return this.postRepository.find({
      where: { category: normalized },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    if (isNaN(id)) throw new BadRequestException('Invalid post ID');

    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.findOne(id);
    const imageUrl = file ? `/uploads/${file.filename}` : post.imageUrl;

    Object.assign(post, updatePostDto, { imageUrl });
    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<{ message: string }> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
    return { message: 'Post deleted successfully' };
  }
}
