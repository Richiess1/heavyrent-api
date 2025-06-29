// machines.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './machine.entity/machine.entity';
import { UsersService } from 'src/users/users.service';
import { CreateMachineDto } from './dto/create-machine.dto';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

const mockUsersService = () => ({
  findById: jest.fn(),
});

describe('MachinesService', () => {
  let service: MachinesService;
  let repo: Repository<Machine>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachinesService,
        { provide: getRepositoryToken(Machine), useFactory: mockRepo },
        { provide: UsersService, useFactory: mockUsersService },
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    repo = module.get(getRepositoryToken(Machine));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a machine if user exists', async () => {
    const dto: CreateMachineDto = { name: 'Excavadora', description: 'Potente', pricePerDay: 100 };
    const user = { id: 1 };

    usersService.findById = jest.fn().mockResolvedValue(user);
    repo.create = jest.fn().mockReturnValue({ ...dto, createdBy: user });
    repo.save = jest.fn().mockResolvedValue('savedMachine');

    const result = await service.create(dto, { userId: 1 });
    expect(result).toBe('savedMachine');
  });

  it('should throw error if user not found', async () => {
    usersService.findById = jest.fn().mockResolvedValue(null);
    await expect(service.create({ name: 'M', description: 'D', pricePerDay: 100 }, { userId: 1 })).rejects.toThrow('usuario no encontrado');
  });

  it('should call repo.create and save with correct params', async () => {
    const dto = { name: 'Nombre', description: 'Desc', pricePerDay: 123 };
    const user = { id: 3 };
    usersService.findById = jest.fn().mockResolvedValue(user);
    repo.create = jest.fn().mockReturnValue('machineCreated');
    repo.save = jest.fn().mockResolvedValue('machineSaved');

    const result = await service.create(dto, { userId: 3 });
    expect(repo.create).toHaveBeenCalledWith({
      name: dto.name,
      description: dto.description,
      createdBy: user,
      available: true,
    });
    expect(repo.save).toHaveBeenCalledWith('machineCreated');
    expect(result).toBe('machineSaved');
  });

  it('should find all machines with createdBy relation', async () => {
    const mockMachines = ['m1', 'm2'];
    repo.find = jest.fn().mockResolvedValue(mockMachines);
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ relations: ['createdBy'] });
    expect(result).toBe(mockMachines);
  });

  it('should handle empty machine list', async () => {
    repo.find = jest.fn().mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should not mutate input dto in create', async () => {
    const dto: CreateMachineDto = { name: 'Nombre', description: 'Descripcion', pricePerDay: 100 };
    const dtoCopy = { ...dto };
    usersService.findById = jest.fn().mockResolvedValue({ id: 1 });
    repo.create = jest.fn().mockReturnValue({});
    repo.save = jest.fn().mockResolvedValue({});
    await service.create(dto, { userId: 1 });
    expect(dto).toEqual(dtoCopy);
  });
});
