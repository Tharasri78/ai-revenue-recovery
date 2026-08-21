import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { RecoveryService } from './recovery.service';

describe('RecoveryService', () => {
  const prisma = {
    transaction: { findFirst: jest.fn() },
    recoveryCase: { create: jest.fn(), findFirst: jest.fn(), findMany: jest.fn(), count: jest.fn(), update: jest.fn() },
    recoveryAttempt: { findFirst: jest.fn(), create: jest.fn(), findMany: jest.fn() },
    $transaction: jest.fn(),
  };
  const service = new RecoveryService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('creates a case for an owned failed transaction', async () => {
    prisma.transaction.findFirst.mockResolvedValue({ id: 'txn-a', paymentStatus: 'FAILED' });
    prisma.recoveryCase.create.mockResolvedValue({ id: 'case-a', merchantId: 'merchant-a', transactionId: 'txn-a' });

    await service.create('merchant-a', 'txn-a', { transactionId: 'txn-a' });

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'txn-a', merchantId: 'merchant-a' } }));
    expect(prisma.recoveryCase.create).toHaveBeenCalledWith({ data: { merchantId: 'merchant-a', transactionId: 'txn-a' } });
  });

  it('rejects a transaction owned by another merchant', async () => {
    prisma.transaction.findFirst.mockResolvedValue(null);

    await expect(service.create('merchant-a', 'txn-b', { transactionId: 'txn-b' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('prevents duplicate recovery cases', async () => {
    prisma.transaction.findFirst.mockResolvedValue({ id: 'txn-a', paymentStatus: 'ABANDONED' });
    prisma.recoveryCase.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: '7.9.1' }),
    );

    await expect(service.create('merchant-a', 'txn-a', { transactionId: 'txn-a' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('calculates the next attempt number for an owned case', async () => {
    prisma.recoveryCase.findFirst.mockResolvedValue({ id: 'case-a' });
    prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) => callback({
      ...prisma,
      recoveryAttempt: {
        findFirst: jest.fn().mockResolvedValue({ attemptNumber: 2 }),
        create: jest.fn().mockResolvedValue({ id: 'attempt-3', attemptNumber: 3 }),
      },
    }));

    await service.createAttempt('merchant-a', 'case-a', { action: 'RETRY_PAYMENT' });
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});