import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

// Mock for PrismaService
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  // Mock do UsersService
  const mockUsersService = {
    create: jest.fn((dto: CreateUserDto) => ({
      id: 'mock-id',
      ...dto,
    })),
    findAll: jest.fn(() => [
      {
        id: 'mock-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    update: jest.fn((id: string, dto: UpdateUserDto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn((id: string) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      expect(await usersController.create(createUserDto)).toEqual({
        id: 'mock-id',
        ...createUserDto,
      });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await usersController.findAll()).toEqual([
        {
          id: 'mock-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const id = 'mock-id';
      expect(await usersController.findOne(id)).toEqual({
        id,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const id = 'mock-id';
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      expect(await usersController.update(id, updateUserDto)).toEqual({
        id,
        ...updateUserDto,
      });
      expect(usersService.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const id = 'mock-id';
      expect(await usersController.remove(id)).toEqual({ id });
      expect(usersService.remove).toHaveBeenCalledWith(id);
    });
  });
});
