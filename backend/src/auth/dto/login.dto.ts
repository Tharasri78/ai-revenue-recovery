import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'aarav@northwindstudio.in' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secure-password' })
  @IsString()
  @MinLength(8)
  password: string;
}