import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

interface AuthenticatedRequest extends Request { user: AuthUser }

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @Permissions('TRANSACTION_CREATE')
  @ApiOperation({ summary: 'Create a transaction for the authenticated merchant' })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTransactionDto) { return this.service.create(req.user.merchantId, dto); }

  @Get()
  @Permissions('TRANSACTION_READ')
  findAll(@Req() req: AuthenticatedRequest, @Query() query: TransactionQueryDto) { return this.service.findAll(req.user.merchantId, query); }

  @Get(':id')
  @Permissions('TRANSACTION_READ')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) { return this.service.findOne(req.user.merchantId, id); }

  @Patch(':id')
  @Permissions('TRANSACTION_UPDATE')
  update(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateTransactionDto) { return this.service.update(req.user.merchantId, id, dto); }
}