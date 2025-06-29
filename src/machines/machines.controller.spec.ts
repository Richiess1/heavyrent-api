import { Test, TestingModule } from '@nestjs/testing';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';

describe('MachinesController', () => {
  let controller: MachinesController;
  let service: MachinesService;
  let mockMachinesService: { create: jest.Mock; findAll: jest.Mock };

  beforeEach(async () => {
    mockMachinesService = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        {
          provide: MachinesService,
          useValue: mockMachinesService,
        },
      ],
    }).compile();

    controller = module.get<MachinesController>(MachinesController);
    service = module.get<MachinesService>(MachinesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería llamar machinesService.create() con dto y user', async () => {
    const dto: CreateMachineDto = {
      name: 'Excavadora',
      description: 'Máquina para excavar',
      pricePerDay: 150,
    };
    const user = { userId: 1 };
    const req = { user };
    mockMachinesService.create.mockResolvedValue('machine created');

    const result = await controller.create(dto, req);

    expect(service.create).toHaveBeenCalledWith(dto, user);
    expect(result).toBe('machine created');
  });

  it('debería lanzar error si machinesService.create() falla', async () => {
    const dto = { name: 'Bulldozer', description: 'Maquinaria pesada', pricePerDay: 200 };
    const req = { user: { userId: 2 } };

    mockMachinesService.create.mockRejectedValue(new Error('Error en creación'));

    await expect(controller.create(dto, req)).rejects.toThrow('Error en creación');
  });

  it('debería lanzar error si req.user está ausente (caso borde)', async () => {
    const dto = { name: 'Retroexcavadora', description: 'Para zanjas', pricePerDay: 120 };
    const req: any = {}; // Usuario no autenticado

    await expect(controller.create(dto, req)).rejects.toThrow('Usuario no autenticado');
  });


  it('debería llamar machinesService.findAll() y devolver máquinas', async () => {
    const machines = [
      { id: 1, name: 'Grúa' },
      { id: 2, name: 'Excavadora' },
    ];
    mockMachinesService.findAll.mockResolvedValue(machines);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(machines);
  });

  it('debería manejar error en machinesService.findAll()', async () => {
    mockMachinesService.findAll.mockRejectedValue(new Error('Error al listar'));

    await expect(controller.findAll()).rejects.toThrow('Error al listar');
  });

  it('debería devolver una lista vacía si no hay máquinas', async () => {
    mockMachinesService.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(result).toEqual([]);
  });
});
