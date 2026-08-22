import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { withMerchantScope } from '../auth/merchant-scope';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findPolicy(merchantId: string) {
    const policy = await this.prisma.recoveryPolicy.findFirst({
      where: withMerchantScope({}, merchantId),
      orderBy: { updatedAt: 'desc' },
    });

    return policy;
  }

  async updateOrCreatePolicy(
    merchantId: string,
    dto: {
      name?: string;
      description?: string;
      mode?: 'MANUAL' | 'ASSISTED' | 'AUTONOMOUS';
      configuration?: Record<string, unknown>;
    },
  ) {
    const existing = await this.findPolicy(merchantId);

    let policy;
    if (existing) {
      policy = await this.prisma.recoveryPolicy.update({
        where: { id: existing.id },
        data: {
          name: dto.name ?? existing.name,
          description: dto.description ?? existing.description,
          mode: dto.mode ?? existing.mode,
          configuration: dto.configuration
            ? (dto.configuration as any)
            : existing.configuration,
        },
      });
    } else {
      policy = await this.prisma.recoveryPolicy.create({
        data: {
          merchantId,
          name: dto.name || 'Default Recovery Policy',
          description: dto.description || 'Standard merchant recovery configuration',
          mode: dto.mode || 'ASSISTED',
          configuration: (dto.configuration || {
            maximumRetryAttempts: 2,
            maximumCustomerMessages: 2,
            maximumDiscount: 200,
            recoveryWindowHours: 48,
            maximumAutoRecoveryAmount: 25000,
            requireApprovalAbove: 25000,
          }) as any,
        },
      });
    }

    await this.auditLogsService.recordLog({
      merchantId,
      action: existing ? 'UPDATE_POLICY' : 'CREATE_POLICY',
      entityType: 'POLICY',
      entityId: policy.id,
      metadata: { mode: policy.mode, name: policy.name },
    });

    return policy;
  }
}
