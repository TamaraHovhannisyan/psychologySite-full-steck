import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { Admin } from './entities/admin.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Admin> {
    const existingAdmin = await this.adminRepo.findOne({
      where: { username: dto.username },
    });
    if (existingAdmin) {
      throw new ConflictException('Username already in use');
    }

    const hashedPassword: string = await bcrypt.hash(dto.password, 10);

    const newAdmin = this.adminRepo.create({
      username: dto.username,
      password: hashedPassword,
      role: 'admin',
    });

    return this.adminRepo.save(newAdmin);
  }

  async logIn(dto: LoginDto, res: Response): Promise<{ access_token: string }> {
    const admin = await this.adminRepo.findOne({
      where: { username: dto.username },
    });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, username: admin.username };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '10d',
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return { access_token: token };
  }
}
