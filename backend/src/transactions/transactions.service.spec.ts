import { ConflictException, NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Prisma } from '../../generated/prisma/client';

describe('TransactionsService', () => {
  const prisma = {
    transaction: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const service = new TransactionsService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('creates a transaction using only the authenticated merchant', async () => {
    prisma.transaction.create.mockResolvedValue({ id: 'txn-1', merchantId: 'merchant-a', amount: 100 });

    await service.create('merchant-a', {
      amount: 100,
      currency: 'inr',
      paymentStatus: 'FAILED',
      paymentMethod: 'UPI',
    });

    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ merchantId: 'merchant-a', currency: 'INR' }),
    });
  });

  it('does not return another merchant transaction', async () => {
    prisma.transaction.findFirst.mockResolvedValue(null);

    await expect(service.findOne('merchant-a', 'txn-b')).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.transaction.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'txn-b', merchantId: 'merchant-a' } }),
    );
  });

  it('scopes list queries and pagination to the authenticated merchant', async () => {
    prisma.transaction.findMany.mockResolvedValue([]);
    prisma.transaction.count.mockResolvedValue(0);
    prisma.$transaction.mockResolvedValue([[], 0]);

    await service.findAll('merchant-a', { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { merchantId: 'merchant-a' } }));
    expect(prisma.transaction.count).toHaveBeenCalledWith({ where: { merchantId: 'merchant-a' } });
  });

  it('translates duplicate external references to a conflict', async () => {
    prisma.transaction.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: '7.9.1' }),
    );

    await expect(service.create('merchant-a', {
      amount: 100,
      currency: 'INR',
      paymentStatus: 'FAILED',
      paymentMethod: 'UPI',
    })).rejects.toBeInstanceOf(ConflictException);
  });
});