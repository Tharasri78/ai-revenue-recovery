import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Max, Min } from 'class-validator';
import { RecoveryAction, RecoveryOutcome, RecoveryStatus } from '../../../generated/prisma/enums';

export class CreateRecoveryDto {
  @ApiPropertyOptional({ description: 'Transaction UUID for this recovery case' })
  @IsUUID()
  transactionId: string;

  @ApiPropertyOptional({ example: 0.84 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  recoveryScore?: number;

  @ApiPropertyOptional({ example: 0.92 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  recoverableAmount?: number;

  @ApiPropertyOptional({ enum: RecoveryAction })
  @IsOptional()
  @IsEnum(RecoveryAction)
  selectedAction?: RecoveryAction;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendationReason?: string;

  @ApiPropertyOptional({ enum: RecoveryStatus })
  @IsOptional()
  @IsEnum(RecoveryStatus)
  status?: RecoveryStatus;

  @ApiPropertyOptional({ enum: RecoveryOutcome })
  @IsOptional()
  @IsEnum(RecoveryOutcome)
  outcome?: RecoveryOutcome;
}