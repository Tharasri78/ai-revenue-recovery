import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const merchant = await tx.merchant.create({
          data: {
            businessName: dto.businessName,
            businessEmail: dto.businessEmail,
            status: 'ACTIVE',
          },
        });

        const role = await tx.role.upsert({
          where: { name: 'MERCHANT_ADMIN' },
          update: {},
          create: {
            name: 'MERCHANT_ADMIN',
            description: 'Full access to merchant operations',
          },
        });

        const existingUser = await tx.user.findFirst({
          where: { email: dto.email },
          select: { id: true },
        });

        if (existingUser) {
          throw new ConflictException('A user with this email already exists');
        }

        const user = await tx.user.create({
          data: {
            merchantId: merchant.id,
            roleId: role.id,
            name: dto.name,
            email: dto.email,
            passwordHash,
            status: 'ACTIVE',
          },
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
            role: { select: { name: true } },
          },
        });

        return { merchant, user };
      });

      return {
        message: 'Merchant account created successfully',
        merchant: {
          id: result.merchant.id,
          businessName: result.merchant.businessName,
          businessEmail: result.merchant.businessEmail,
          status: result.merchant.status,
        },
        user: result.user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A merchant or user with these details already exists');
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
      include: {
        role: true,
        merchant: true,
      },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE' || user.merchant.status !== 'ACTIVE') {
      throw new ForbiddenException('This account is inactive or suspended');
    }

    const payload: JwtPayload = {
      userId: user.id,
      merchantId: user.merchantId,
      role: user.role.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<JwtSignOptions['expiresIn']>(
          'JWT_EXPIRES_IN',
          '1d',
        ),
      }),
      user: this.sanitizeUser(user),
      merchant: this.sanitizeMerchant(user.merchant),
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, merchant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Authenticated user no longer exists');
    }

    return {
      user: this.sanitizeUser(user),
      merchant: this.sanitizeMerchant(user.merchant),
    };
  }

  private sanitizeUser(user: {
    id: string;
    email: string;
    name: string;
    status: string;
    merchantId: string;
    role: { name: string };
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      merchantId: user.merchantId,
      role: user.role.name,
    };
  }

  private sanitizeMerchant(merchant: {
    id: string;
    businessName: string;
    businessEmail: string;
    status: string;
  }) {
    return {
      id: merchant.id,
      businessName: merchant.businessName,
      businessEmail: merchant.businessEmail,
      status: merchant.status,
    };
  }
}