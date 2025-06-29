import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';

describe('RentalsController', () => {
  let controller: RentalsController;
  let service: RentalsService;

  const mockRentalsService = {
    create: jest.fn(),
    findByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [
        {
          provide: RentalsService,
          useValue: mockRentalsService,
        },
      ],
    }).compile();

    controller = module.get<RentalsController>(RentalsController);
    service = module.get<RentalsService>(RentalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería llamar rentalsService.create() con dto y user', async () => {
    const dto: CreateRentalDto = {
      machineId: 1,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const user = { userId: 42 };
    const req = { user };

    mockRentalsService.create.mockResolvedValue('nuevo alquiler');

    const result = await controller.create(dto, req);

    expect(service.create).toHaveBeenCalledWith(dto, user);
    expect(result).toBe('nuevo alquiler');
  });

  it('debería manejar un error en rentalsService.create()', async () => {
    const dto = { machineId: 1, startDate: new Date().toISOString(), endDate: new Date().toISOString() };
    const req = { user: { userId: 5 } };

    mockRentalsService.create.mockRejectedValue(new Error('Error inesperado'));

    await expect(controller.create(dto, req)).rejects.toThrow('Error inesperado');
  });

  it('debería llamar rentalsService.findByUser() con el ID del usuario', async () => {
    const req = { user: { userId: 7 } };
    mockRentalsService.findByUser.mockResolvedValue(['rental1', 'rental2']);

    const result = await controller.findByUser(req);

    expect(service.findByUser).toHaveBeenCalledWith(7);
    expect(result).toEqual(['rental1', 'rental2']);
  });

  it('debería manejar un error en rentalsService.findByUser()', async () => {
    const req = { user: { userId: 8 } };
    mockRentalsService.findByUser.mockRejectedValue(new Error('No se pudo obtener alquileres'));

    await expect(controller.findByUser(req)).rejects.toThrow('No se pudo obtener alquileres');
  });

  it('debería lanzar error si req.user está indefinido (caso edge)', async () => {
    const req: any = {}; // sin .user

    await expect(controller.findByUser(req)).rejects.toThrow('Usuario no autenticado');
  });


});
