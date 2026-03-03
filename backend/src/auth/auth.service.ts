import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthRepository } from './auth.repository';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(credentials: AuthCredentialsDto) {
    const existing = await this.authRepository.findByEmail(credentials.email);

    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(credentials.password, 10);

    const user = await this.authRepository.createUser(
      credentials.name,
      credentials.email,
      passwordHash,
    );

    return user;
  }

  async validatePassword(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginCredentials: AuthLoginDto) {
    const user = await this.validatePassword(
      loginCredentials.email,
      loginCredentials.password,
    );

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async validateToken(userId: number, email: string, expiry: number) {
    if (Date.now() > expiry * 1000) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = user.id === userId;

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
