import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { PostsService } from '../posts/posts.service';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsService: PostsService,
  ) {}

  async save(obj: Partial<User>) {
    const entity = this.usersRepository.create(obj);
    // QueryFailedError: SQLITE_CONSTRAINT: NOT NULL constraint failed: users.id
    entity.id = uuid4();
    entity.posts = obj.posts?.map((post) => {
      return { ...post, id: uuid4() };
    });
    return await this.usersRepository.save(entity);
  }

  async update(id: string, attrs: Partial<User>) {
    const entity = await this.findByIdOrThrowError(id, () => {
      throw new NotFoundException(`User not found | id=${id}`);
    });

    Object.assign(entity, attrs);
    return await this.save(entity);
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({
      where: {
        id: id,
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
      throw new NotFoundException(`User not found | id=${id}`);
    });
    return await this.usersRepository.remove(entity);
  }

  async getEmailAndPostTitles(id: string) {
    const user = await this.findByIdOrThrowError(id, () => {
      throw new NotFoundException(`User not found | id=${id}`);
    });

    const posts = await this.postsService.findByUserId(user.id);

    return {
      email: user.email,
      titles: posts.map((post) => post.title),
    };
  }
}
