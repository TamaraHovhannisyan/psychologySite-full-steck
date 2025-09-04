import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { Throttle, seconds } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

type JwtUser = { userId: string; email: string; role?: string };
interface AuthenticatedRequest extends Request {
  user: JwtUser;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new admin user' })
  @ApiCreatedResponse({ description: 'User registered successfully.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiConflictResponse({ description: 'Email already in use.' })
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  async register(@Body() dto: RegisterDto): Promise<{ access_token: string }> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiOkResponse({ description: 'Successfully logged in.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @Throttle({ default: { limit: 10, ttl: seconds(60) } })
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    const token = await this.authService.validateUser(dto.email, dto.password);
    if (!token) throw new UnauthorizedException('Invalid credentials');
    return { access_token: token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in admin profile' })
  @ApiOkResponse({ description: 'Returns the user profile.' })
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
