import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';
import { PaymentMethod, TransactionStatus } from '../../../generated/prisma/enums';

export class CreateTransactionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalReference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerReference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty({ example: 4999 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'INR' })
  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  currency: string;

  @ApiProperty({ enum: TransactionStatus, example: TransactionStatus.FAILED })
  @IsEnum(TransactionStatus)
  paymentStatus: TransactionStatus;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.UPI })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  failureReason?: string;
}