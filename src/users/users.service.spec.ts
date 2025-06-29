// tests/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  const userArray = [
    { id: 1, email: 'a@test.com', name: 'A' },
    { id: 2, email: 'b@test.com', name: 'B' }
  ] as User[];

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return existing user on findOrCreate', async () => {
    repo.findOne!.mockResolvedValue(userArray[0]);
    const result = await service.findOrCreate({ email: 'a@test.com', name: 'A' });
    expect(result).toBe(userArray[0]);
  });

  it('should create and return new user if not found', async () => {
    repo.findOne!.mockResolvedValue(null);
    repo.create!.mockReturnValue(userArray[1]);
    repo.save!.mockResolvedValue(userArray[1]);

    const result = await service.findOrCreate({ email: 'b@test.com', name: 'B' });
    expect(repo.create).toBeCalledWith({ email: 'b@test.com', name: 'B' });
    expect(repo.save).toBeCalledWith(userArray[1]);
    expect(result).toBe(userArray[1]);
  });

  it('should call findById', async () => {
    repo.findOne!.mockResolvedValue(userArray[0]);
    const result = await service.findById(1);
    expect(result).toBe(userArray[0]);
  });

  it('should call findAll and return users', async () => {
    repo.find!.mockResolvedValue(userArray);
    const result = await service.findAll();
    expect(result).toHaveLength(2);
  });

  it('should call userRepository.findOne in findOrCreate', async () => {
    repo.findOne!.mockResolvedValue(null);
    repo.create!.mockReturnValue(userArray[0]);
    repo.save!.mockResolvedValue(userArray[0]);
    await service.findOrCreate({ email: 'new@test.com', name: 'New' });
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'new@test.com' } });
  });

  it('should handle null return in findById', async () => {
    repo.findOne!.mockResolvedValue(null);
    const result = await service.findById(999);
    expect(result).toBeNull();
  });
});
