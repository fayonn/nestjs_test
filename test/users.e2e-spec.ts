import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersRepository } from '../src/modules/users/users.repository';
import { PostsRepository } from '../src/modules/posts/posts.repository';
import { User } from '../src/modules/users/user.entity';
import { v4 as uuid4 } from 'uuid';
import { DataSource } from 'typeorm';
import { UserDto } from '../src/modules/users/dtos/user.dto';
import { Post } from '../src/modules/posts/post.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let postsRepository: PostsRepository;
  let dbConnection: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    postsRepository = moduleFixture.get<PostsRepository>(PostsRepository);
    dbConnection = usersRepository.manager.connection;
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // sqlite
    // const tableNames = dbConnection.entityMetadatas.map(
    //   (entity) => `"${entity.tableName}"`,
    // );
    await dbConnection.query(`DELETE FROM "posts"`);
    await dbConnection.query(`DELETE FROM "users"`);
  });

  describe('/:id (GET)', () => {
    let userId: string;

    beforeEach(async () => {
      userId = uuid4();
      await usersRepository.save({
        id: userId,
        email: '1',
        password: '1',
      } as User);
    });

    it('should be 200', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(body.id).toBe(userId);
    });

    it('should be 404', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/users/${uuid4()}`)
        .expect(404);

      expect(body.error).toBe('Not Found');
    });
  });

  describe('/ (POST)', () => {
    const user = {
      email: '1',
      password: '1',
    } as UserDto;

    it('should be 201', async () => {
      const { body } = await request(app.getHttpServer())
        .post(`/users`)
        .send(user)
        .expect(201);

      expect(body.email).toBe(user.email);
      expect(body.id).toBeDefined();
      expect(body.password).toBeFalsy();
    });
  });

  describe('/:id (Put)', () => {
    let userId: string;
    let putUser: User;

    beforeEach(async () => {
      userId = uuid4();
      await usersRepository.save({
        id: userId,
        email: '1',
        password: '1',
      } as User);

      putUser = {
        id: userId,
        email: '2',
        password: '1',
      } as User;
    });

    it('should be 200', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(putUser)
        .expect(200);

      expect(body.email).toBe(putUser.email);
    });

    it('should be 404', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/users/${uuid4()}`)
        .send(putUser)
        .expect(404);

      expect(body.error).toBe('Not Found');
    });
  });

  describe('/:id (DELETE)', () => {
    let userId: string;

    beforeEach(async () => {
      userId = uuid4();
      await usersRepository.save({
        id: userId,
        email: '1',
        password: '1',
      } as User);
    });

    it('should be 200', async () => {
      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
    });

    it('should be 404', async () => {
      const { body } = await request(app.getHttpServer())
        .delete(`/users/${uuid4()}`)
        .expect(404);

      expect(body.error).toBe('Not Found');
    });
  });

  describe('/:id/posts (GET)', () => {
    let userId: string;

    beforeEach(async () => {
      userId = uuid4();
      await usersRepository.save({
        id: userId,
        email: '1',
        password: '1',
        posts: [
          {
            id: uuid4(),
            title: 'q',
            message: 'w',
          } as Post,
          {
            title: 'e',
            message: 'r',
            id: uuid4(),
          } as Post,
          {
            title: 't',
            message: 'y',
            id: uuid4(),
          } as Post,
        ],
      } as User);
    });

    it('should be 200', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/users/${userId}/posts`)
        .expect(200);

      expect(body.length).toBe(3);
    });
  });

  describe('/:id/titles (GET)', () => {
    let userId: string;

    beforeEach(async () => {
      userId = uuid4();
      await usersRepository.save({
        id: userId,
        email: '1',
        password: '1',
        posts: [
          {
            id: uuid4(),
            title: 'q',
            message: 'w',
          } as Post,
          {
            title: 'e',
            message: 'r',
            id: uuid4(),
          } as Post,
          {
            title: 't',
            message: 'y',
            id: uuid4(),
          } as Post,
        ],
      } as User);
    });

    it('should be 200', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/users/${userId}/titles`)
        .expect(200);

      expect(body.email).toBe('1');
      expect(body.titles.length).toBe(3);
    });

    it('should be 404', async () => {
      const { body } = await request(app.getHttpServer())
        .delete(`/users/${uuid4()}`)
        .expect(404);

      expect(body.error).toBe('Not Found');
    });
  });
});
