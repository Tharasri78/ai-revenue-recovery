import {
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';

describe('PermissionsGuard', () => {
  const prisma = {
    role: { findUnique: jest.fn() },
  };
  const reflector = {
    getAllAndOverride: jest.fn(),
  };
  const guard = new PermissionsGuard(
    reflector as unknown as Reflector,
    prisma as never,
  );

  function contextFor(user?: { userId: string; merchantId: string; role: string }) {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    reflector.getAllAndOverride.mockReturnValue(['TRANSACTION_READ']);
  });

  it('allows an admin permission', async () => {
    prisma.role.findUnique.mockResolvedValue({
      permissions: [{ permission: { name: 'TRANSACTION_READ' } }],
    });

    await expect(
      guard.canActivate(contextFor({ userId: 'u1', merchantId: 'm1', role: 'MERCHANT_ADMIN' })),
    ).resolves.toBe(true);
  });

  it('allows an operator permission', async () => {
    prisma.role.findUnique.mockResolvedValue({
      permissions: [{ permission: { name: 'TRANSACTION_READ' } }],
    });

    await expect(
      guard.canActivate(contextFor({ userId: 'u2', merchantId: 'm1', role: 'MERCHANT_OPERATOR' })),
    ).resolves.toBe(true);
  });

  it('denies an analyst write permission', async () => {
    reflector.getAllAndOverride.mockReturnValue(['TRANSACTION_UPDATE']);
    prisma.role.findUnique.mockResolvedValue({
      permissions: [{ permission: { name: 'TRANSACTION_READ' } }],
    });

    await expect(
      guard.canActivate(contextFor({ userId: 'u3', merchantId: 'm1', role: 'ANALYST' })),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('denies a user without the required permission', async () => {
    prisma.role.findUnique.mockResolvedValue({ permissions: [] });

    await expect(
      guard.canActivate(contextFor({ userId: 'u4', merchantId: 'm1', role: 'ANALYST' })),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('returns 401 when authentication has not populated the request user', async () => {
    await expect(guard.canActivate(contextFor())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});