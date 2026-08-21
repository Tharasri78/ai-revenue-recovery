import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthUser } from '../interfaces/auth-user.interface';

interface PermissionRequest extends Request {
  user?: AuthUser;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<PermissionRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication is required');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: user.role },
      select: {
        permissions: {
          select: { permission: { select: { name: true } } },
        },
      },
    });

    const grantedPermissions = new Set(
      role?.permissions.map(({ permission }) => permission.name) ?? [],
    );

    if (!requiredPermissions.every((permission) => grantedPermissions.has(permission))) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}