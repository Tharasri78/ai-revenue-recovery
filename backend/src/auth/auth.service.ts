import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    const existingMerchant = await this.prisma.merchant.findUnique({
      where: {
        businessEmail: dto.businessEmail,
      },
    });

    if (existingMerchant) {
      throw new ConflictException(
        'A merchant account with this business email already exists',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const result = await this.prisma.$transaction(async (tx) => {
      const merchant = await tx.merchant.create({
        data: {
          businessName: dto.businessName,
          businessEmail: dto.businessEmail,
          status: 'ACTIVE',
        },
      });

      const role = await tx.role.upsert({
        where: {
          name: 'MERCHANT_ADMIN',
        },
        update: {},
        create: {
          name: 'MERCHANT_ADMIN',
          description: 'Full access to merchant operations',
        },
      });

      const user = await tx.user.create({
        data: {
          merchantId: merchant.id,
          roleId: role.id,
          name: dto.name,
          email: dto.email,
          passwordHash,
          status: 'ACTIVE',
        },
      });

      return {
        merchant,
        user,
      };
    });

    return {
      message: 'Merchant account created successfully',
      merchantId: result.merchant.id,
      userId: result.user.id,
    };
  }
}