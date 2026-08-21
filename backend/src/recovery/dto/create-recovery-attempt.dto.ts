import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { RecoveryAction, RecoveryOutcome } from '../../../generated/prisma/enums';

export class CreateRecoveryAttemptDto {
  @ApiProperty({ enum: RecoveryAction }) @IsEnum(RecoveryAction) action: RecoveryAction;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @IsPositive() attemptNumber?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() amount?: number;
  @ApiPropertyOptional({ enum: RecoveryOutcome }) @IsOptional() @IsEnum(RecoveryOutcome) outcome?: RecoveryOutcome;
  @ApiPropertyOptional() @IsOptional() @IsString() failureReason?: string;
}