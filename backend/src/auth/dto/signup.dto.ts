import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'Northwind Studio' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'owner@northwindstudio.in' })
  @IsEmail()
  businessEmail: string;

  @ApiProperty({ example: 'Aarav Mehta' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'aarav@northwindstudio.in' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secure-password' })
  @IsString()
  @MinLength(8)
  password: string;
}