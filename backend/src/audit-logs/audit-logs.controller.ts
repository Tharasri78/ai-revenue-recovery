import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { AuditEntityType } from '../../generated/prisma/client';
import { AuditLogsService } from './audit-logs.service';

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@ApiTags('Audit Logs')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get merchant audit log events' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'entityType', required: false, enum: AuditEntityType })
  async getAuditLogs(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('entityType') entityType?: AuditEntityType,
  ) {
    return this.auditLogsService.findAll(req.user.merchantId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      entityType,
    });
  }
}
