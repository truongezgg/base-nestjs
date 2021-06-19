import { RequirePermissions } from '$app/shared/authorization/permissions.decorator';
import { Public } from '$core/decorators/public.decorator';
import { validate } from '$helpers/validate';
import { IToken } from '$types/interfaces';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { adminLoginSchema, adminRegisterSchema } from './admin-auth.schema';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: AdminLoginDto): Promise<IToken> {
    validate(adminLoginSchema, body);
    return this.adminAuthService.login(body);
  }

  @Public()
  @Post('register')
  async register(@Body() body: AdminRegisterDto): Promise<IToken> {
    validate(adminRegisterSchema, body);
    return await this.adminAuthService.register(body);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<{ token: string }> {
    validate({ type: 'string', minLength: 1 }, refreshToken);
    const token = await this.adminAuthService.refreshToken(refreshToken);
    return { token };
  }

  // @Public()
  @Get('is-email-exists')
  async checkIsAnyUserHasEmail(@Query('email') email: string): Promise<{ isEmailExists: boolean }> {
    validate({ format: 'email', type: 'string' }, email);
    const isEmailExists = await this.adminAuthService.isEmailExists(email);
    return { isEmailExists };
  }
}
