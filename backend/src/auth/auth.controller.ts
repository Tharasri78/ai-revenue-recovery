import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Permissions } from './decorators/permissions.decorator';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthUser } from './interfaces/auth-user.interface';

interface AuthenticatedRequest extends Request {
	user: AuthUser;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@ApiOperation({ summary: 'Create a merchant account and its first admin user' })
	signup(@Body() dto: SignupDto) {
		return this.authService.signup(dto);
	}

	@Post('login')
	@ApiOperation({ summary: 'Authenticate a merchant user' })
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get the authenticated user and merchant' })
	me(@Req() request: AuthenticatedRequest) {
		return this.authService.me(request.user.userId);
	}

	@Get('access-check')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions('MERCHANT_READ')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Verify JWT, RBAC, and merchant context' })
	accessCheck(@Req() request: AuthenticatedRequest) {
		return {
			userId: request.user.userId,
			merchantId: request.user.merchantId,
			role: request.user.role,
		};
	}
}
