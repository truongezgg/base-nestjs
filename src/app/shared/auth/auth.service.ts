import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CONFIG from '$config';
import { JWTType } from '$types/enums';
import config from '$config';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  generateAccessToken(payload: any): string {
    Object.assign(payload, { tokenType: JWTType.ACCESS_TOKEN });

    return this.jwtService.sign(payload, {
      secret: config.JWT_SECRET_KEY,
      expiresIn: CONFIG.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: any): string {
    Object.assign(payload, { tokenType: JWTType.REFRESH_TOKEN });

    return this.jwtService.sign(payload, {
      secret: config.JWT_SECRET_KEY,
      expiresIn: CONFIG.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, { secret: config.JWT_SECRET_KEY });
      return payload?.tokenType === JWTType.ACCESS_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: config.JWT_SECRET_KEY });

      return payload?.tokenType === JWTType.REFRESH_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }
}
