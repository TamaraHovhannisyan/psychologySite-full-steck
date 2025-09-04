import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dtos/register.dto';

type AccessToken = { access_token: string };

@Injectable()
export class AuthService {
  private readonly saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  private readonly allowSelfRegister =
    process.env.ALLOW_SELF_REGISTER !== 'false';
  private readonly defaultRegisterRole = (process.env.DEFAULT_REGISTER_ROLE ||
    'user') as User['role'];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AccessToken> {
    if (!this.allowSelfRegister) {
      throw new ForbiddenException('Self-registration is disabled');
    }

    const email = registerDto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.saltRounds,
    );

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: this.defaultRegisterRole,
    });

    try {
      await this.userRepository.save(user);
    } catch (e: any) {
      if (e?.code === '23505') {
        throw new ConflictException('User already exists');
      }
      throw e;
    }

    return { access_token: await this.signToken(user) };
  }

  async validateUser(email: string, password: string): Promise<string> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user);
  }

  async login(email: string, password: string): Promise<AccessToken> {
    const token = await this.validateUser(email, password);
    return { access_token: token };
  }

  private signToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.signAsync(payload);
  }
}
