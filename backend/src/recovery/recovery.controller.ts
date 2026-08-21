import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateRecoveryAttemptDto } from './dto/create-recovery-attempt.dto';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { RecoveryQueryDto } from './dto/recovery-query.dto';
import { UpdateRecoveryDto } from './dto/update-recovery.dto';
import { RecoveryService } from './recovery.service';

interface AuthenticatedRequest extends Request { user: AuthUser }

@ApiTags('Recovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('recovery')
export class RecoveryController {
  constructor(private readonly service: RecoveryService) {}

  @Post()
  @Permissions('RECOVERY_CREATE')
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateRecoveryDto) { return this.service.create(req.user.merchantId, dto.transactionId, dto); }

  @Get()
  @Permissions('RECOVERY_READ')
  findAll(@Req() req: AuthenticatedRequest, @Query() query: RecoveryQueryDto) { return this.service.findAll(req.user.merchantId, query); }

  @Get(':id/attempts')
  @Permissions('RECOVERY_READ')
  findAttempts(@Req() req: AuthenticatedRequest, @Param('id') id: string) { return this.service.findAttempts(req.user.merchantId, id); }

  @Get(':id')
  @Permissions('RECOVERY_READ')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) { return this.service.findOne(req.user.merchantId, id); }

  @Patch(':id')
  @Permissions('RECOVERY_UPDATE')
  update(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateRecoveryDto) { return this.service.update(req.user.merchantId, id, dto); }

  @Post(':id/attempts')
  @Permissions('RECOVERY_UPDATE')
  createAttempt(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() dto: CreateRecoveryAttemptDto) { return this.service.createAttempt(req.user.merchantId, id, dto); }
}