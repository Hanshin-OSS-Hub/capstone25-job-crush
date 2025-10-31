// 인증 컨트롤러
// 인증 관련 API 엔드포인트를 정의합니다

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: DTO 및 서비스 로직 구현
  // @Post('login')
  // async login(@Body() loginDto: LoginDto) {
  //   return this.authService.login(loginDto);
  // }
}

