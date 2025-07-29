import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { PostImage } from '../entities/post-image.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { Express } from 'express';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async create(
    dto: CreatePostDto,
    files: Express.Multer.File[],
  ): Promise<PostEntity> {
    if (!files || files.length < 1) {
      throw new BadRequestException('At least one image is required');
    }

    const post = this.postRepository.create({
      title: dto.title,
      description: dto.description,
    });

    const savedPost = await this.postRepository.save(post);

    const images = files.map((file) =>
      this.postImageRepository.create({
        url: file.filename,
        postId: savedPost.id,
      }),
    );

    await this.postImageRepository.save(images);

    return this.postRepository.findOneOrFail({
      where: { id: savedPost.id },
    });
  }

  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find();
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(
    id: string,
    dto: UpdatePostDto,
    files?: Express.Multer.File[],
  ): Promise<PostEntity> {
    const post = await this.findOne(id);

    Object.assign(post, dto);
    await this.postRepository.save(post);

    if (files && files.length > 0) {
      const images = files.map((file) =>
        this.postImageRepository.create({
          url: file.filename,
          postId: post.id,
        }),
      );
      await this.postImageRepository.save(images);
    }

    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }
}
