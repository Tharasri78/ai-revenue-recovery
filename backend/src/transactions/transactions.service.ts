import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { withMerchantScope } from '../auth/merchant-scope';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(merchantId: string, dto: CreateTransactionDto) {
    try {
      const transaction = await this.prisma.transaction.create({
        data: { ...dto, merchantId, currency: dto.currency.toUpperCase() },
      });
      return this.toResponse(transaction);
    } catch (error) {
      this.handleConflict(error);
      throw error;
    }
  }

  async findAll(merchantId: string, query: TransactionQueryDto) {
    const where: Prisma.TransactionWhereInput = withMerchantScope({}, merchantId);
    if (query.status) where.paymentStatus = query.status;
    if (query.paymentMethod) where.paymentMethod = query.paymentMethod;
    if (query.search) {
      where.OR = [
        { externalReference: { contains: query.search, mode: 'insensitive' } },
        { customerReference: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerEmail: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }

    const skip = (query.page - 1) * query.limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toResponse(item)),
      total,
      pagination: { page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async findOne(merchantId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: withMerchantScope({ id }, merchantId),
      include: { recoveryCase: { include: { attempts: true } } },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return this.toResponse(transaction);
  }

  async update(merchantId: string, id: string, dto: UpdateTransactionDto) {
    try {
      const result = await this.prisma.transaction.updateMany({
        where: withMerchantScope({ id }, merchantId),
        data: { ...dto, ...(dto.currency ? { currency: dto.currency.toUpperCase() } : {}) },
      });
      if (result.count === 0) throw new NotFoundException('Transaction not found');
      return this.findOne(merchantId, id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handleConflict(error);
      throw error;
    }
  }

  private toResponse(transaction: Record<string, unknown>) {
    return transaction;
  }

  private handleConflict(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('External reference already exists for this merchant');
    }
  }
}