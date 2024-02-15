import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { generateMock } from '../../../test/utils/generateMock';
import { PostsService } from '../posts/posts.service';
import { Mocked } from 'jest-mock';
import { v4 as uuid4 } from 'uuid';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let postsService: Mocked<PostsService>;
  let usersService: Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: PostsService,
          useValue: generateMock(PostsService),
        },
        {
          provide: UsersService,
          useValue: generateMock(UsersService),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<Mocked<UsersService>>(UsersService);
    postsService = module.get<Mocked<PostsService>>(PostsService);
  });

  describe('getOne', () => {
    const userId = uuid4();
    const user = {
      id: userId,
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be retrieved', async () => {
      usersService.findByIdOrThrowError.mockResolvedValue(user);

      const result = await controller.getOne(userId);
      expect(result).toBeDefined();
    });

    it('should exception be thrown', async () => {
      usersService.findByIdOrThrowError.mockRejectedValue(NotFoundException);
      await expect(controller.getOne(userId)).rejects.toThrow();
    });
  });

  describe('create', () => {
    const user = {
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be created', async () => {
      usersService.save.mockResolvedValue(user);

      const result = await controller.create(user);
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    const userId = uuid4();
    const user = {
      id: userId,
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be updated', async () => {
      usersService.update.mockResolvedValue(user);

      const result = await controller.update(userId, user);
      expect(result).toBeDefined();
    });
  });

  describe('delete', () => {
    const userId = uuid4();
    const user = {
      id: userId,
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be deleted', async () => {
      usersService.deleteById.mockResolvedValue(user);

      await controller.delete(userId);
      expect(usersService.deleteById).toHaveBeenCalled();
    });
  });

  describe('getUsersPosts', () => {
    const userId = uuid4();
    const posts = [
      {
        id: uuid4(),
        title: 'test title',
        message: 'test message',
        user: {
          id: userId,
        },
      } as Post,
      {
        id: uuid4(),
        title: 'test title',
        message: 'test message',
        user: {
          id: userId,
        },
      } as Post,
      {
        id: uuid4(),
        title: 'test title',
        message: 'test message',
        user: {
          id: userId,
        },
      } as Post,
    ];

    it('should all user`s posts were retrieved', async () => {
      postsService.findByUserId.mockResolvedValue(posts);

      const result = await controller.getUsersPosts(userId);
      expect(result).toBeDefined();
    });
  });

  describe('getTitles', () => {
    const userId = uuid4();
    const titles = {
      email: 'test@email.com',
      titles: ['test', 'test', 'test'],
    };

    it('should all user`s titles were retrieved', async () => {
      usersService.getEmailAndPostTitles.mockResolvedValue(titles);

      const result = await controller.getTitles(userId);
      expect(result).toBeDefined();
    });
  });
});
