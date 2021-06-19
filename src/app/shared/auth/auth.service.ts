import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '$types/enums';
import config from '$config';
import { IPayload } from '$types/interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(payload: IPayload): string {
    return this.jwtService.sign(
      { ...payload, tokenType: TokenType.ACCESS_TOKEN },
      {
        secret: config.JWT_SECRET_KEY,
        expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    );
  }

  public generateRefreshToken(payload: IPayload): string {
    return this.jwtService.sign(
      { ...payload, tokenType: TokenType.REFRESH_TOKEN },
      {
        secret: config.JWT_SECRET_KEY,
        expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    );
  }

  public verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, { secret: config.JWT_SECRET_KEY });
      return payload?.tokenType === TokenType.ACCESS_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }

  public verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: config.JWT_SECRET_KEY });
      return payload?.tokenType === TokenType.REFRESH_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }
}
