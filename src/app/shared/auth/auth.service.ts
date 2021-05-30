import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '$types/enums';
import config from '$config';
import { IPayload } from '$types/interfaces';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  generateAccessToken(payload: IPayload): string {
    Object.assign(payload, { tokenType: TokenType.ACCESS_TOKEN });

    return this.jwtService.sign(payload, {
      secret: config.JWT_SECRET_KEY,
      expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: IPayload): string {
    Object.assign(payload, { tokenType: TokenType.REFRESH_TOKEN });

    return this.jwtService.sign(payload, {
      secret: config.JWT_SECRET_KEY,
      expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, { secret: config.JWT_SECRET_KEY });
      return payload?.tokenType === TokenType.ACCESS_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: config.JWT_SECRET_KEY });

      return payload?.tokenType === TokenType.REFRESH_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }
}
