import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('dashboard')
  @Permissions('TRANSACTION_READ', 'RECOVERY_READ')
  @ApiOperation({ summary: 'Get merchant-scoped dashboard analytics' })
  getDashboard(@Req() req: AuthenticatedRequest) {
    return this.service.getDashboard(req.user.merchantId);
  }
}
