import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { withMerchantScope } from '../auth/merchant-scope';

type DashboardTransaction = Awaited<ReturnType<AnalyticsService['getTransactions']>>[number];

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(merchantId: string) {
    const transactions = await this.getTransactions(merchantId);
    const recoveryCases = transactions.flatMap((transaction) =>
      transaction.recoveryCase ? [transaction.recoveryCase] : [],
    );
    const attempts = recoveryCases.flatMap((recoveryCase) =>
      recoveryCase.attempts.map((attempt) => ({
        ...attempt,
        transaction: recoveryCase.transaction,
      })),
    );

    const revenueAtRisk = this.sumAmounts(
      transactions.filter((transaction) =>
        ['FAILED', 'ABANDONED'].includes(transaction.paymentStatus),
      ),
    );
    const recoverableAmounts = recoveryCases
      .map((recoveryCase) => this.toNumber(recoveryCase.recoverableAmount))
      .filter((amount): amount is number => amount !== null);
    const potentiallyRecoverable = recoverableAmounts.length
      ? recoverableAmounts.reduce((sum, amount) => sum + amount, 0)
      : null;
    const recoveredFromTransactions = this.sumAmounts(
      transactions.filter((transaction) => transaction.paymentStatus === 'RECOVERED'),
    );
    const recoveredFromAttempts = attempts
      .filter((attempt) => attempt.outcome === 'SUCCESS')
      .reduce((sum, attempt) => sum + (this.toNumber(attempt.amount) ?? 0), 0);
    const revenueRecovered = recoveredFromTransactions + recoveredFromAttempts;
    const recoveryBase = potentiallyRecoverable ?? revenueAtRisk;
    const recoveryRate = recoveryBase > 0 ? (revenueRecovered / recoveryBase) * 100 : 0;

    return {
      kpis: [
        {
          label: 'Revenue at Risk',
          value: this.formatCurrency(revenueAtRisk),
          delta: 'Live',
          description: 'FAILED and ABANDONED transaction amount',
        },
        {
          label: 'Potentially Recoverable',
          value: potentiallyRecoverable === null ? 'Not available' : this.formatCurrency(potentiallyRecoverable),
          delta: potentiallyRecoverable === null ? 'No AI estimate' : 'Live',
          description: 'Sum of recovery cases with recoverableAmount set',
        },
        {
          label: 'Revenue Recovered',
          value: this.formatCurrency(revenueRecovered),
          delta: 'Live',
          description: 'RECOVERED transactions plus successful attempt amounts',
        },
        {
          label: 'Recovery Rate',
          value: `${recoveryRate.toFixed(1)}%`,
          delta: 'Live',
          description: 'Recovered revenue divided by available recovery base',
        },
      ],
      revenueTrend: this.getRevenueTrend(transactions, attempts),
      funnel: [
        { label: 'Failed / abandoned revenue', value: revenueAtRisk },
        { label: 'Potentially recoverable', value: potentiallyRecoverable ?? 0 },
        { label: 'Recovery attempts', value: attempts.length },
        { label: 'Successfully recovered', value: revenueRecovered },
      ],
      recoveryReasons: this.getFailureReasonShare(transactions),
      recoveryActivity: recoveryCases
        .slice()
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 5)
        .map((recoveryCase) => ({
          transactionId: recoveryCase.transaction.externalReference ?? recoveryCase.transactionId,
          amount: this.toNumber(recoveryCase.transaction.amount) ?? 0,
          problem: recoveryCase.transaction.failureReason ?? 'No failure reason recorded',
          recommendation: recoveryCase.selectedAction?.replaceAll('_', ' ') ?? 'No recommendation',
          confidence: recoveryCase.confidence === null ? null : (this.toNumber(recoveryCase.confidence) ?? 0) * 100,
          policy: recoveryCase.outcome.replaceAll('_', ' '),
          status: recoveryCase.status.replaceAll('_', ' '),
        })),
      recentActivity: attempts
        .slice()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map((attempt) => ({
          id: attempt.id,
          text: `${attempt.createdAt.toISOString()} - ${attempt.transaction.externalReference ?? attempt.transaction.id} - ${attempt.action.replaceAll('_', ' ')} - ${attempt.outcome}`,
        })),
      totals: {
        transactions: transactions.length,
        recoveryCases: recoveryCases.length,
        recoveryAttempts: attempts.length,
      },
    };
  }

  private getTransactions(merchantId: string) {
    return this.prisma.transaction.findMany({
      where: withMerchantScope({}, merchantId),
      include: {
        recoveryCase: {
          include: {
            transaction: true,
            attempts: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  private getRevenueTrend(
    transactions: DashboardTransaction[],
    attempts: Array<{ outcome: string; amount: unknown; createdAt: Date }>,
  ) {
    const buckets = new Map<string, { label: string; revenueAtRisk: number; recovered: number }>();

    for (const transaction of transactions) {
      const label = transaction.createdAt.toLocaleString('en-US', { month: 'short' });
      const bucket = buckets.get(label) ?? { label, revenueAtRisk: 0, recovered: 0 };
      if (['FAILED', 'ABANDONED'].includes(transaction.paymentStatus)) {
        bucket.revenueAtRisk += this.toNumber(transaction.amount) ?? 0;
      }
      if (transaction.paymentStatus === 'RECOVERED') {
        bucket.recovered += this.toNumber(transaction.amount) ?? 0;
      }
      buckets.set(label, bucket);
    }

    for (const attempt of attempts) {
      if (attempt.outcome !== 'SUCCESS') continue;
      const label = attempt.createdAt.toLocaleString('en-US', { month: 'short' });
      const bucket = buckets.get(label) ?? { label, revenueAtRisk: 0, recovered: 0 };
      bucket.recovered += this.toNumber(attempt.amount) ?? 0;
      buckets.set(label, bucket);
    }

    return Array.from(buckets.values()).slice(-6);
  }

  private getFailureReasonShare(transactions: DashboardTransaction[]) {
    const atRisk = transactions.filter((transaction) =>
      ['FAILED', 'ABANDONED'].includes(transaction.paymentStatus),
    );
    const total = atRisk.length;
    const counts = new Map<string, number>();

    for (const transaction of atRisk) {
      const reason = transaction.failureReason || 'Unknown';
      counts.set(reason, (counts.get(reason) ?? 0) + 1);
    }

    if (total === 0) return [];

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, value: Math.round((count / total) * 100) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }

  private sumAmounts(items: Array<{ amount: unknown }>) {
    return items.reduce((sum, item) => sum + (this.toNumber(item.amount) ?? 0), 0);
  }

  private toNumber(value: unknown) {
    if (value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
