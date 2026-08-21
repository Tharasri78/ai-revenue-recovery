import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  const prisma = {
    merchant: { findUnique: jest.fn() },
    user: { findFirst: jest.fn(), findUnique: jest.fn() },
    $transaction: jest.fn(),
  };
  const jwtService = { signAsync: jest.fn() };
  const configService = { get: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a merchant and returns no password hash', async () => {
    prisma.merchant.findUnique.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    prisma.$transaction.mockImplementation(async (callback: (tx: unknown) => unknown) =>
      callback({
        merchant: {
          create: jest.fn().mockResolvedValue({
            id: 'merchant-id',
            businessName: 'Northwind Studio',
            businessEmail: 'owner@example.com',
            status: 'ACTIVE',
          }),
        },
        role: { upsert: jest.fn().mockResolvedValue({ id: 'role-id' }) },
        user: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            id: 'user-id',
            email: 'owner@example.com',
            name: 'Aarav Mehta',
            status: 'ACTIVE',
            role: { name: 'MERCHANT_ADMIN' },
          }),
        },
      }),
    );

    const result = await service.signup({
      businessName: 'Northwind Studio',
      businessEmail: 'owner@example.com',
      name: 'Aarav Mehta',
      email: 'owner@example.com',
      password: 'secure-password',
    });

    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.merchant.id).toBe('merchant-id');
  });

  it('rejects invalid login credentials', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      service.login({ email: 'owner@example.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an existing merchant email during signup', async () => {
    prisma.merchant.findUnique.mockResolvedValue({ id: 'existing-merchant' });

    await expect(
      service.signup({
        businessName: 'Northwind Studio',
        businessEmail: 'owner@example.com',
        name: 'Aarav Mehta',
        email: 'owner@example.com',
        password: 'secure-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
