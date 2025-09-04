import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './entities/post.entity';
import { PostService } from './services/post.service';
import {
  AdminPostController,
  PostController,
} from './controllers/post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [AdminPostController, PostController],
  providers: [PostService],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}
