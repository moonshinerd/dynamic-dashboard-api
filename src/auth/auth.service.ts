import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '../config/env';
import type { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: number;
  clientId: number;
  email: string;
}

export interface AuthenticatedUser {
  userId: number;
  clientId: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    if (dto.email !== env.AUTH_EMAIL || dto.password !== env.AUTH_PASSWORD) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: 1,
      clientId: env.AUTH_CLIENT_ID,
      email: dto.email,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
