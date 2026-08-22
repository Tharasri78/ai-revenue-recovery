import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const prisma = {
    transaction: {
      findMany: jest.fn(),
    },
  };
  const service = new AnalyticsService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('calculates merchant-scoped dashboard metrics from existing records', async () => {
    const createdAt = new Date('2026-08-20T10:00:00.000Z');
    prisma.transaction.findMany.mockResolvedValue([
      {
        id: 'txn-failed',
        merchantId: 'merchant-a',
        externalReference: 'TXN-001',
        amount: 5000,
        paymentStatus: 'FAILED',
        failureReason: 'Temporary failure',
        createdAt,
        recoveryCase: {
          id: 'case-a',
          transactionId: 'txn-failed',
          status: 'APPROVED',
          outcome: 'PENDING',
          recoverableAmount: null,
          selectedAction: null,
          confidence: null,
          updatedAt: createdAt,
          transaction: {
            id: 'txn-failed',
            externalReference: 'TXN-001',
            amount: 5000,
            failureReason: 'Temporary failure',
          },
          attempts: [
            {
              id: 'attempt-a',
              action: 'SEND_RECOVERY_LINK',
              outcome: 'SUCCESS',
              amount: 3000,
              createdAt,
            },
          ],
        },
      },
      {
        id: 'txn-abandoned',
        merchantId: 'merchant-a',
        externalReference: 'TXN-002',
        amount: 2000,
        paymentStatus: 'ABANDONED',
        failureReason: 'Abandoned checkout',
        createdAt,
        recoveryCase: null,
      },
    ]);

    const result = await service.getDashboard('merchant-a');

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { merchantId: 'merchant-a' } }),
    );
    expect(result.kpis[0]).toEqual(expect.objectContaining({ label: 'Revenue at Risk', value: '₹7,000' }));
    expect(result.kpis[1]).toEqual(expect.objectContaining({ label: 'Potentially Recoverable', value: 'Not available' }));
    expect(result.kpis[2]).toEqual(expect.objectContaining({ label: 'Revenue Recovered', value: '₹3,000' }));
    expect(result.funnel).toEqual([
      { label: 'Failed / abandoned revenue', value: 7000 },
      { label: 'Potentially recoverable', value: 0 },
      { label: 'Recovery attempts', value: 1 },
      { label: 'Successfully recovered', value: 3000 },
    ]);
    expect(result.recoveryReasons).toEqual([
      { name: 'Temporary failure', value: 50 },
      { name: 'Abandoned checkout', value: 50 },
    ]);
    expect(result.recoveryOutcomes).toEqual([{ label: 'SUCCESS', value: 1 }]);
  });
});
