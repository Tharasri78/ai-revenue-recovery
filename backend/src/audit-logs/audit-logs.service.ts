import { Injectable } from '@nestjs/common';
import { AuditEntityType, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { withMerchantScope } from '../auth/merchant-scope';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async recordLog(data: {
    merchantId: string;
    userId?: string;
    action: string;
    entityType: AuditEntityType;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          merchantId: data.merchantId,
          userId: data.userId || null,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId || null,
          metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
        },
      });
    } catch (error) {
      // Audit logging errors should not crash main application mutations
      console.error('Failed to record audit log:', error);
      return null;
    }
  }

  async findAll(
    merchantId: string,
    query: {
      page?: number;
      limit?: number;
      entityType?: AuditEntityType;
    },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = withMerchantScope(
      query.entityType ? { entityType: query.entityType } : {},
      merchantId,
    );

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      items,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
