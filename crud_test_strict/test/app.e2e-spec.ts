import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Test the 'create' endpoint
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test7@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201); // Expect HTTP status 201 Created

      expect(response.body).toMatchObject({
        id: expect.any(String), // The ID should be a string
        ...createUserDto,
        createdAt: expect.any(String), // createdAt and updatedAt are ISO strings
        updatedAt: expect.any(String),
      });
    });
  });

  // Test the 'findAll' endpoint
  describe('GET /users', () => {
    it('should return an array of users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200); // Expect HTTP status 200 OK

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            email: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            phone: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  // Test the 'findOne' endpoint
  describe('GET /users/:id', () => {
    it('should return a single user by id', async () => {
      const userId = '21cede43-86e2-4da5-a8f3-115d84ced8a4'; // Replace with a valid user ID

      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200); // Expect HTTP status 200 OK

      expect(response.body).toMatchObject({
        id: userId,
        email: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        phone: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  // Test the 'update' endpoint
  describe('PATCH /users/:id', () => {
    it('should update a user by id', async () => {
      const userId = '8ff52f76-e821-4269-9a6c-a10ba24ab440'; // Replace with a valid user ID
      const updateUserDto = { firstName: 'Navas' };

      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateUserDto)
        .expect(200); // Expect HTTP status 200 OK

      expect(response.body).toMatchObject({
        id: userId,
        firstName: 'Navas',
        // Include other fields as needed
        updatedAt: expect.any(String),
      });
    });
  });

  // Test the 'remove' endpoint
  describe('DELETE /users/:id', () => {
    it('should remove a user by id', async () => {
      const userId = '8ff52f76-e821-4269-9a6c-a10ba24ab440'; // Replace with a valid user ID

      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200); // Expect HTTP status 200 OK
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello Assustadus!');
  });

  afterAll(async () => {
    await app.close();
  });
});
