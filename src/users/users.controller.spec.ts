import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
  };

  const fakeUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call usersService.findById with a number', async () => {
    mockUsersService.findById.mockResolvedValue(fakeUser);
    const result = await controller.findOne('1');
    expect(usersService.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeUser);
  });

  it('should convert string id to number', async () => {
    mockUsersService.findById.mockResolvedValue(fakeUser);
    await controller.findOne('123');
    expect(usersService.findById).toHaveBeenCalledWith(123);
  });

  it('should return null if user not found', async () => {
    mockUsersService.findById.mockResolvedValue(null);
    const result = await controller.findOne('999');
    expect(result).toBeNull();
  });

  it('should handle invalid id (non-numeric string)', async () => {
    const result = await controller.findOne('abc');
    // NaN se convierte en número, depende de cómo manejes findById
    expect(usersService.findById).toHaveBeenCalledWith(NaN);
  });

  it('should throw if usersService.findById throws', async () => {
    mockUsersService.findById.mockRejectedValue(new Error('DB error'));
    await expect(controller.findOne('1')).rejects.toThrow('DB error');
  });

  it('should handle boundary id = 0', async () => {
    mockUsersService.findById.mockResolvedValue(null);
    const result = await controller.findOne('0');
    expect(usersService.findById).toHaveBeenCalledWith(0);
    expect(result).toBeNull();
  });
});
