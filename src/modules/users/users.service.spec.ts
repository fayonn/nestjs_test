import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PostsService } from '../posts/posts.service';
import { generateMock } from '../../../test/utils/generateMock';
import { Mocked } from 'jest-mock';
import { v4 as uuid4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Mocked<UsersRepository>;
  let postsService: Mocked<PostsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: generateMock(UsersRepository),
        },
        {
          provide: PostsService,
          useValue: generateMock(PostsService),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Mocked<UsersRepository>>(UsersRepository);
    postsService = module.get<Mocked<PostsService>>(PostsService);
  });

  describe('save', () => {
    const user = {
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be saved', async () => {
      usersRepository.create.mockReturnValue(user);
      usersRepository.save.mockResolvedValue(user);

      const result = await service.save(user);
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
      usersRepository.save.mockResolvedValue(user);
      usersRepository.findOne.mockResolvedValue({
        ...user,
        email: 'old_test@email.com',
      });

      const result = await service.update(userId, user);
      expect(result.email).toBe(user.email);
    });

    it('should not exists', async () => {
      usersRepository.save.mockResolvedValue(user);
      usersRepository.findOne.mockResolvedValue(undefined);

      await expect(service.update(userId, user)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    const userId = uuid4();
    const user = {
      id: userId,
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be found', async () => {
      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(userId);
      expect(result).toBeDefined();
    });
  });

  describe('findByIdOrThrowError', () => {
    const userId = uuid4();
    const user = {
      id: userId,
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be found', async () => {
      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.findByIdOrThrowError(userId, () => {
        throw new NotFoundException();
      });
      expect(result).toBeDefined();
    });

    it('should not be found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.findByIdOrThrowError(userId, () => {
          throw new NotFoundException();
        }),
      ).rejects.toThrow();
    });
  });

  describe('deleteById', () => {
    const userId = uuid4();
    const user = {
      id: userId,
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be deleted', async () => {
      usersRepository.remove.mockResolvedValue(user);
      usersRepository.findOne.mockResolvedValue(user);

      await service.deleteById(userId);
      expect(usersRepository.remove).toHaveBeenCalled();
    });

    it('should not found', async () => {
      usersRepository.remove.mockResolvedValue(user);
      usersRepository.findOne.mockResolvedValue(undefined);

      await expect(service.deleteById(userId)).rejects.toThrow();
    });
  });

  describe('getEmailAndPostTitles', () => {
    const userId = uuid4();
    const user = {
      id: userId,
      email: 'test@email.com',
      password: 'test password',
    } as User;

    it('should be retrieved', async () => {
      postsService.findByUserId.mockResolvedValue([
        {
          id: uuid4(),
          title: 'test title',
          message: 'test message',
          user: {
            id: uuid4(),
          },
        },
      ]);
      jest.spyOn(service, 'findByIdOrThrowError').mockResolvedValue(user);

      const titles = await service.getEmailAndPostTitles(userId);
      expect(service.findByIdOrThrowError).toHaveBeenCalled();
      expect(postsService.findByUserId).toHaveBeenCalled();
      expect(titles).toBeDefined();
    });

    it('should user not found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      postsService.findByUserId.mockResolvedValue([]);

      await expect(service.getEmailAndPostTitles(userId)).rejects.toThrow();
    });
  });
});
