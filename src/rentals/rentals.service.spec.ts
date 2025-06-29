// rentals.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RentalRequest } from './rental-request.entity/rental-request.entity';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { Repository } from 'typeorm';
import { CreateRentalDto } from './dto/create-rental.dto';

const mockRentalRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

const mockMachineRepo = () => ({
  findOneBy: jest.fn(),
});

describe('RentalsService', () => {
  let service: RentalsService;
  let rentalRepo: Repository<RentalRequest>;
  let machineRepo: Repository<Machine>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        { provide: getRepositoryToken(RentalRequest), useFactory: mockRentalRepo },
        { provide: getRepositoryToken(Machine), useFactory: mockMachineRepo },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
    rentalRepo = module.get(getRepositoryToken(RentalRequest));
    machineRepo = module.get(getRepositoryToken(Machine));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a rental if machine exists', async () => {
    const dto: CreateRentalDto = {
      machineId: 1,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const user = { id: 1 } as any;
    const machine = { id: 1 } as Machine;

    machineRepo.findOneBy = jest.fn().mockResolvedValue(machine);
    rentalRepo.create = jest.fn().mockReturnValue({ ...dto, machine, user, status: 'pending' });
    rentalRepo.save = jest.fn().mockResolvedValue('savedRental');

    const result = await service.create(dto, user);
    expect(result).toBe('savedRental');
    expect(machineRepo.findOneBy).toHaveBeenCalledWith({ id: dto.machineId });
  });

  it('should throw error if machine not found', async () => {
    machineRepo.findOneBy = jest.fn().mockResolvedValue(null);
    await expect(service.create({ machineId: 2, startDate: new Date().toISOString(), endDate: new Date().toISOString() }, { id: 1 } as any)).rejects.toThrow();
  });

  it('should call rentalRepo.create and save', async () => {
    const dto = { machineId: 1, startDate: new Date().toISOString(), endDate: new Date().toISOString() };
    const user = { id: 1 } as any;
    const machine = {} as Machine;

    machineRepo.findOneBy = jest.fn().mockResolvedValue(machine);
    rentalRepo.create = jest.fn().mockReturnValue('rentalCreated');
    rentalRepo.save = jest.fn().mockResolvedValue('rentalSaved');

    const result = await service.create(dto, user);
    expect(rentalRepo.create).toHaveBeenCalled();
    expect(rentalRepo.save).toHaveBeenCalledWith('rentalCreated');
    expect(result).toBe('rentalSaved');
  });

  it('should find rentals by user id', async () => {
    const mockRentals = ['r1', 'r2'];
    rentalRepo.find = jest.fn().mockResolvedValue(mockRentals);
    const result = await service.findByUser(1);
    expect(rentalRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
      relations: ['machine', 'user'],
    });
    expect(result).toBe(mockRentals);
  });

  it('should handle empty results from findByUser', async () => {
    rentalRepo.find = jest.fn().mockResolvedValue([]);
    const result = await service.findByUser(5);
    expect(result).toEqual([]);
  });

  it('should not mutate the input DTO when creating', async () => {
    const dto: CreateRentalDto = {
      machineId: 1,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const dtoCopy = { ...dto };
    machineRepo.findOneBy = jest.fn().mockResolvedValue({} as Machine);
    rentalRepo.create = jest.fn().mockReturnValue({});
    rentalRepo.save = jest.fn().mockResolvedValue({});
    await service.create(dto, { id: 1 } as any);
    expect(dto).toEqual(dtoCopy);
  });
});
