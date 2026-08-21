import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { RecoveryStatus } from '../../../generated/prisma/enums';

export class RecoveryQueryDto {
  @ApiPropertyOptional({ default: 1 }) @Type(() => Number) @IsInt() @IsPositive() @IsOptional() page = 1;
  @ApiPropertyOptional({ default: 20, maximum: 100 }) @Type(() => Number) @IsInt() @IsPositive() @Max(100) @IsOptional() limit = 20;
  @ApiPropertyOptional({ enum: RecoveryStatus }) @IsOptional() @IsEnum(RecoveryStatus) status?: RecoveryStatus;
}