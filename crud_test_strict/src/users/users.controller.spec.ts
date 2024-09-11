import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

      const result = await usersController.create(createUserDto);

      const expectedResult = {
        id: 'mock-id',
        ...createUserDto,
      };

      expect(result).toEqual(expectedResult);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await usersController.findAll();
      const exprectedResult = {
        id: 'mock-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      expect(result).toEqual([exprectedResult]);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const id = 'mock-id';

      const result = await usersController.findOne(id);
      const expectedResult = {
        id,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
      expect(result).toEqual(expectedResult);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const id = 'mock-id';
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      const result = await usersController.update(id, updateUserDto);
      const expectedResult = {
        id,
        ...updateUserDto,
      };

      expect(result).toEqual(expectedResult);
      expect(usersService.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const id = 'mock-id';

      const result = await usersController.remove(id);
      const expectedResult = { id };

      expect(result).toEqual(expectedResult);
      expect(usersService.remove).toHaveBeenCalledWith(id);
    });
  });
});
