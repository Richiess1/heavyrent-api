import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateOAuthLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a googleAuth method (empty)', async () => {
    const result = await controller.googleAuth();
    expect(result).toBeUndefined(); // método vacío
  });

  it('should call validateOAuthLogin with correct params on redirect', async () => {
    const mockReq = {
      user: {
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    mockAuthService.validateOAuthLogin.mockResolvedValue({
      acces_token: 'token123',
    });

    const result = await controller.googleAuthRedirect(mockReq);
    expect(authService.validateOAuthLogin).toHaveBeenCalledWith(
      mockReq.user.email,
      mockReq.user.name,
    );
    expect(result).toEqual({ acces_token: 'token123' });
  });

  it('should return the access_token from authService', async () => {
    const mockReq = {
      user: { email: 'a@a.com', name: 'A' },
    };

    const token = { acces_token: 'abc123' };
    mockAuthService.validateOAuthLogin.mockResolvedValue(token);

    const result = await controller.googleAuthRedirect(mockReq);
    expect(result).toEqual(token);
  });

  it('should handle missing user in request', async () => {
    const mockReq = {};

    await expect(
      controller.googleAuthRedirect(mockReq as any),
    ).rejects.toThrow();
  });

  it('should throw if validateOAuthLogin throws', async () => {
    const mockReq = {
      user: { email: 'fail@test.com', name: 'Fail' },
    };

    mockAuthService.validateOAuthLogin.mockRejectedValue(
      new Error('OAuth error'),
    );

    await expect(
      controller.googleAuthRedirect(mockReq),
    ).rejects.toThrow('OAuth error');
  });

});
