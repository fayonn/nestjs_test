import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';

@Module({
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}
