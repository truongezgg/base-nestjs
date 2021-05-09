import { PartialType } from '@nestjs/mapped-types';

export class RegisterAuthDto {
  email: string;
  password: string;
}

export class LoginAuthDto extends PartialType(RegisterAuthDto) {
  email: string;
  password: string;
}

export class RequestAccessTokenDto {
  refreshToken: string;
}
