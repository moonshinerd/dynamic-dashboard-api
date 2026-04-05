import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { loginSchema, LoginDto } from './dto/login.dto';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';

class LoginBodyDto {
  email: string;
  password: string;
}

class LoginResponseDto {
  access_token: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate and obtain a JWT access token' })
  @ApiBody({
    type: LoginBodyDto,
    examples: {
      default: {
        summary: 'Login credentials',
        value: { email: 'user@example.com', password: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed - invalid email or empty password' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(dto);
  }
}
