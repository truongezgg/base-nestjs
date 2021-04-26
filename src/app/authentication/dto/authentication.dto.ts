import { PartialType } from '@nestjs/mapped-types';

export class RegisterAuthenticationDto {
  email: string;
  password: string;
}

export class LoginAuthenticationDto extends PartialType(RegisterAuthenticationDto) {
  email: string;
  password: string;
}

export class RequestAccessTokenDto {
  refreshToken: string;
}
