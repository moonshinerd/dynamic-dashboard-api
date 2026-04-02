import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema, LoginDto } from './dto/login.dto';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Body: { email: string, password: string }
   * Returns: { access_token: string }
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(dto);
  }
}
