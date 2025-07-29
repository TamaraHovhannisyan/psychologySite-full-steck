import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostImage])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
