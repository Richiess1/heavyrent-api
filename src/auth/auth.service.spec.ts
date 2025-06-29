import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsersService = {
    findOrCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call usersService.findOrCreate with correct arguments', async () => {
    const data = { email: 'test@example.com', name: 'Test User' };
    const user = { id: 1, email: data.email };
    mockUsersService.findOrCreate.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('token');

    await service.validateOAuthLogin(data.email, data.name);

    expect(mockUsersService.findOrCreate).toHaveBeenCalledWith(data);
  });

  it('should call jwtService.sign with correct payload', async () => {
    const user = { id: 1, email: 'test@example.com' };
    mockUsersService.findOrCreate.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('mocked_token');

    await service.validateOAuthLogin(user.email, 'Any Name');

    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: user.email,
      sub: user.id,
    });
  });

  it('should return an object with access_token', async () => {
    const user = { id: 1, email: 'test@example.com' };
    mockUsersService.findOrCreate.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('mocked_token');

    const result = await service.validateOAuthLogin(user.email, 'Any Name');
    expect(result).toEqual({ acces_token: 'mocked_token' });
  });

  it('should return a different token if payload changes', async () => {
    const user = { id: 2, email: 'another@example.com' };
    mockUsersService.findOrCreate.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('another_token');

    const result = await service.validateOAuthLogin(user.email, 'Name');
    expect(result.acces_token).toBe('another_token');
  });

  it('should throw if usersService.findOrCreate throws', async () => {
    mockUsersService.findOrCreate.mockRejectedValue(new Error('DB error'));

    await expect(
      service.validateOAuthLogin('fail@example.com', 'User'),
    ).rejects.toThrow('DB error');
  });

  it('should throw if jwtService.sign throws', async () => {
    mockUsersService.findOrCreate.mockResolvedValue({ id: 1, email: 'test@example.com' });
    mockJwtService.sign.mockImplementation(() => {
      throw new Error('JWT error');
    });

    await expect(
      service.validateOAuthLogin('test@example.com', 'User'),
    ).rejects.toThrow('JWT error');
  });
});
