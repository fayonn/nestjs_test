import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async save(obj: Partial<Post>) {
    const entity = this.postsRepository.create(obj);
    return await this.postsRepository.save(entity);
  }

  async update(id: string, attrs: Partial<Post>) {
    const entity = await this.findByIdOrThrowError(id, () => {
      throw new NotFoundException(`Post not found | id=${id}`);
    });

    Object.assign(entity, attrs);
    return await this.save(entity);
  }

  async findById(id: string) {
    return await this.postsRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByUserId(id: string) {
    return await this.postsRepository.find({
      where: {
        user: { id: id },
      },
    });
  }

  async findByIdOrThrowError(id: string, errorHandler: () => void) {
    const entity = await this.findById(id);
    if (!entity) errorHandler();
    else return entity;
  }

  async deleteById(id: string) {
    const entity = await this.findByIdOrThrowError(id, () => {
      throw new NotFoundException(`Post not found | id=${id}`);
    });
    return await this.postsRepository.remove(entity);
  }
}
