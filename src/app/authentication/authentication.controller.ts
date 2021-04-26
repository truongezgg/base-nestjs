import { ValidationPipe } from '$helpers/validation.pipe';
import { Controller, Post, Body } from '@nestjs/common';
import { loginSchema, registerSchema, requestAccessTokenSchema } from './authentication.schema';
import { AuthenticationService, IToken } from './authentication.service';
import { RegisterAuthenticationDto, LoginAuthenticationDto, RequestAccessTokenDto } from './dto/authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  async login(@Body(new ValidationPipe(loginSchema)) body: LoginAuthenticationDto): Promise<IToken> {
    return await this.authenticationService.login(body);
  }

  @Post('register')
  async register(@Body(new ValidationPipe(registerSchema)) body: RegisterAuthenticationDto) {
    return await this.authenticationService.register(body);
  }

  @Post('request-access-token')
  async requestAccessToken(@Body(new ValidationPipe(requestAccessTokenSchema)) body: RequestAccessTokenDto) {
    return await this.authenticationService.requestAccessToken(body);
  }
}
