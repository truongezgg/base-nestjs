import { Public } from '$decorators/public.decorator';
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
  @Post('/login')
  async login(@Body() body: AdminLoginDto): Promise<IToken> {
    validate(adminLoginSchema, body);
    return this.adminAuthService.login(body);
  }

  @Public()
  @Post('/register')
  async register(@Body() body: AdminRegisterDto) {
    validate(adminRegisterSchema, body);
    return await this.adminAuthService.register(body);
  }

  @Public()
  @Post('/refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    validate({ type: 'string', minLength: 1 }, refreshToken);

    return await this.adminAuthService.refreshToken(refreshToken);
  }

  @Public()
  @Get('/is-email-exists')
  async checkIsAnyUserHasEmail(@Query('email') email: string) {
    validate({ format: 'email', type: 'string' }, email);

    const isEmailExists = await this.adminAuthService.isEmailExists(email);
    return { isEmailExists };
  }
}
