import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { withMerchantScope } from '../auth/merchant-scope';
import { CreateRecoveryAttemptDto } from './dto/create-recovery-attempt.dto';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { RecoveryQueryDto } from './dto/recovery-query.dto';
import { UpdateRecoveryDto } from './dto/update-recovery.dto';

@Injectable()
export class RecoveryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(merchantId: string, transactionId: string, dto: CreateRecoveryDto) {
    const transaction = await this.prisma.transaction.findFirst({ where: withMerchantScope({ id: transactionId }, merchantId), select: { id: true, paymentStatus: true } });
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (!['FAILED', 'ABANDONED'].includes(transaction.paymentStatus)) throw new ConflictException('Only failed or abandoned transactions can receive recovery cases');
    try {
      const { transactionId: _transactionId, ...caseData } = dto;
      return await this.prisma.recoveryCase.create({ data: { ...caseData, merchantId, transactionId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('A recovery case already exists for this transaction');
      throw error;
    }
  }

  async findAll(merchantId: string, query: RecoveryQueryDto) {
    const where = withMerchantScope(query.status ? { status: query.status } : {}, merchantId);
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.recoveryCase.findMany({ where, skip, take: query.limit, include: { transaction: true } }),
      this.prisma.recoveryCase.count({ where }),
    ]);
    return { items, total, pagination: { page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) } };
  }

  async findOne(merchantId: string, id: string) {
    const item = await this.prisma.recoveryCase.findFirst({ where: withMerchantScope({ id }, merchantId), include: { transaction: true, attempts: true } });
    if (!item) throw new NotFoundException('Recovery case not found');
    return item;
  }

  async update(merchantId: string, id: string, dto: UpdateRecoveryDto) {
    const { transactionId: _transactionId, ...caseData } = dto;
    const result = await this.prisma.recoveryCase.updateMany({ where: withMerchantScope({ id }, merchantId), data: caseData });
    if (result.count === 0) throw new NotFoundException('Recovery case not found');
    return this.findOne(merchantId, id);
  }

  async createAttempt(merchantId: string, recoveryCaseId: string, dto: CreateRecoveryAttemptDto) {
    const recoveryCase = await this.prisma.recoveryCase.findFirst({ where: withMerchantScope({ id: recoveryCaseId }, merchantId), select: { id: true } });
    if (!recoveryCase) throw new NotFoundException('Recovery case not found');
    try {
      return await this.prisma.$transaction(async (tx) => {
        const latest = await tx.recoveryAttempt.findFirst({ where: { recoveryCaseId, recoveryCase: { merchantId } }, orderBy: { attemptNumber: 'desc' }, select: { attemptNumber: true } });
        const attemptNumber = dto.attemptNumber ?? (latest?.attemptNumber ?? 0) + 1;
        return tx.recoveryAttempt.create({ data: { recoveryCaseId, action: dto.action, attemptNumber, amount: dto.amount, outcome: dto.outcome, failureReason: dto.failureReason } });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('This recovery attempt number already exists');
      throw error;
    }
  }

  async findAttempts(merchantId: string, recoveryCaseId: string) {
    const recoveryCase = await this.prisma.recoveryCase.findFirst({ where: withMerchantScope({ id: recoveryCaseId }, merchantId), select: { id: true } });
    if (!recoveryCase) throw new NotFoundException('Recovery case not found');
    return this.prisma.recoveryAttempt.findMany({ where: { recoveryCaseId, recoveryCase: { merchantId } }, orderBy: { attemptNumber: 'asc' } });
  }
}
