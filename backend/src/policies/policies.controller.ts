import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { PoliciesService } from './policies.service';

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@ApiTags('Policies')
@Controller('policies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get merchant recovery policy' })
  async getPolicy(@Req() req: AuthenticatedRequest) {
    const policy = await this.policiesService.findPolicy(req.user.merchantId);
    return policy || null;
  }

  @Patch()
  @ApiOperation({ summary: 'Update or create merchant recovery policy' })
  async updatePolicy(
    @Req() req: AuthenticatedRequest,
    @Body()
    dto: {
      name?: string;
      description?: string;
      mode?: 'MANUAL' | 'ASSISTED' | 'AUTONOMOUS';
      configuration?: Record<string, unknown>;
    },
  ) {
    return this.policiesService.updateOrCreatePolicy(req.user.merchantId, dto);
  }
}
