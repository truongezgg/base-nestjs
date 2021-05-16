import { AuthService } from '$app/auth/auth.service';
import { validate } from '$helpers/validate';
import { IToken } from '$types/interfaces';
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '$decorators/public.decorator';
import { LoginAuthDto, RegisterAuthDto, RequestAccessTokenDto } from './auth.dto';
import { loginSchema, registerSchema, requestAccessTokenSchema } from './auth.schema';
import { Permission } from '$types/enums';
import { RequirePermissions } from '$decorators/permissions.decorator';

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
  @Post('/register')
  async register(@Body() body: RegisterAuthDto) {
    validate(registerSchema, body);
    return await this.authService.register(body);
  }

  @Public()
  @Post('/request-access-token')
  async requestAccessToken(@Body() body: RequestAccessTokenDto) {
    validate(requestAccessTokenSchema, body);
    return await this.authService.requestAccessToken(body);
  }

  @Post('/test-authorization')
  @RequirePermissions(Permission.CREATE_CAT, Permission.UPDATE_CAT)
  async testRole() {
    return 'Access';
  }
}
