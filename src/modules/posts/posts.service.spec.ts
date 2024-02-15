import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { v4 as uuid4 } from 'uuid';
import { PostsRepository } from './posts.repository';
import { generateMock } from '../../../test/utils/generateMock';
import { Mocked } from 'jest-mock';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: Mocked<PostsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: generateMock(PostsRepository),
          // useValue: repositoryMock(),
        },
        // {
        //   provide: getDataSourceToken(dataSource),
        //   useValue: dataSourceMock(),
        // },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get<Mocked<PostsRepository>>(PostsRepository);
  });

  describe('save', () => {
    const post = {
      title: 'test title',
      message: 'test message',
      user: {
        id: uuid4(),
      },
    } as Post;

    it('should be saved', async () => {
      postsRepository.create.mockReturnValue(post);
      postsRepository.save.mockResolvedValue(post);

      const result = await service.save(post);
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    const postId = uuid4();
    const post = {
      id: postId,
      title: 'test title',
      message: 'test message',
      user: {
        id: uuid4(),
      },
    } as Post;

    it('should be updated', async () => {
      postsRepository.save.mockResolvedValue(post);
      postsRepository.findOne.mockResolvedValue({
        ...post,
        title: 'old title',
      });

      const result = await service.update(postId, post);
      expect(result.title).toBe(post.title);
    });

    it('should post not exists', async () => {
      // jest.spyOn(service, 'findByIdOrThrowError').mockResolvedValue(undefined)
      postsRepository.save.mockResolvedValue(post);
      postsRepository.findOne.mockResolvedValue(undefined);

      await expect(service.update(postId, post)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    const postId = uuid4();
    const post = {
      id: postId,
      title: 'test title',
      message: 'test message',
      user: {
        id: uuid4(),
      },
    } as Post;

    it('should be found', async () => {
      postsRepository.findOne.mockResolvedValue(post);

      const result = await service.findById(postId);
      expect(result).toBeDefined();
    });
  });

  describe('findByUserId', () => {
    const userId = uuid4();
    const posts = [
      {
        id: uuid4(),
        title: 'test title',
        message: 'test message',
        user: {
          id: uuid4(),
        },
      } as Post,
    ];

    it('should be found', async () => {
      postsRepository.find.mockResolvedValue(posts);

      const result = await service.findByUserId(userId);
      expect(result).toBeDefined();
    });
  });

  describe('findByIdOrThrowError', () => {
    const postId = uuid4();
    const post = {
      id: postId,
      title: 'test title',
      message: 'test message',
      user: {
        id: uuid4(),
      },
    } as Post;

    it('should be found', async () => {
      postsRepository.findOne.mockResolvedValue(post);

      const result = await service.findByIdOrThrowError(postId, () => {
        throw new NotFoundException();
      });
      expect(result).toBeDefined();
    });

    it('should not be found', async () => {
      postsRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.findByIdOrThrowError(postId, () => {
          throw new NotFoundException();
        }),
      ).rejects.toThrow();
    });
  });

  describe('deleteById', () => {
    const postId = uuid4();
    const post = {
      id: postId,
      title: 'test title',
      message: 'test message',
      user: {
        id: uuid4(),
      },
    } as Post;

    it('should be deleted', async () => {
      postsRepository.remove.mockResolvedValue(post);
      postsRepository.findOne.mockResolvedValue(post);

      await service.deleteById(postId);
      expect(postsRepository.remove).toHaveBeenCalled();
    });

    it('should post not found', async () => {
      postsRepository.remove.mockResolvedValue(post);
      postsRepository.findOne.mockResolvedValue(undefined);

      await expect(service.deleteById(postId)).rejects.toThrow();
    });
  });
});
