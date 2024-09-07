import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service'; // Adjust the path as needed
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService }, // Mock PrismaService
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('should be defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      const result = {
        id: 'mock-id',
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(mockPrismaService.user, 'create').mockResolvedValue(result);

      expect(await service.create(createUserDto)).toEqual(result);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          id: 'mock-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(mockPrismaService.user, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const id = 'mock-id';
      const result = {
        id,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(mockPrismaService.user, 'findUnique')
        .mockResolvedValue(result);

      expect(await service.findOne(id)).toEqual(result);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const id = 'mock-id';
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      const result = {
        id,
        ...updateUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(mockPrismaService.user, 'update').mockResolvedValue(result);

      expect(await service.update(id, updateUserDto)).toEqual(result);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: updateUserDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const id = 'mock-id';
      const result = { id };

      jest.spyOn(mockPrismaService.user, 'delete').mockResolvedValue(result);

      expect(await service.remove(id)).toEqual(result);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
