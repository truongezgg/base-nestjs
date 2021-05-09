import { AuthService } from '$app/auth/auth.service';
import { Public } from '$app/auth/jwt-auth.guard';
import { validate } from '$helpers/validate';
import { IToken } from '$types/interfaces';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginAuthDto, RegisterAuthDto, RequestAccessTokenDto } from './auth.dto';
import { loginSchema, registerSchema, requestAccessTokenSchema } from './auth.schema';

@Controller('/auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(@Body() body: LoginAuthDto): Promise<IToken> {
    validate(loginSchema, body);
    return this.authService.login(body);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterAuthDto) {
    validate(registerSchema, body);
    return await this.authService.register(body);
  }

  @Public()
  @Post('request-access-token')
  async requestAccessToken(@Body() body: RequestAccessTokenDto) {
    validate(requestAccessTokenSchema, body);
    return await this.authService.requestAccessToken(body);
  }
}
