import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '$config';
import { UserType, ErrorCode, JWTType } from '$types/enums';
import { EntityManager, getConnection, getRepository, Repository } from 'typeorm';
import User from '$database/entities/User';
import { Exception } from '$helpers/exception';
import { compare, hash } from 'bcrypt';
import { RegisterAuthDto, RequestAccessTokenDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login({ email, password }) {
    return await getConnection().transaction(async (transaction: EntityManager) => {
      const userRepository = transaction.getRepository(User);

      const user = await userRepository.findOne({ where: { email }, select: ['id', 'password', 'refreshToken'] });

      if (!user) {
        throw new Exception(ErrorCode.Email_Or_Password_Not_valid, 'You have provided the wrong email or password');
      }

      const isTruePassword = await compare(password, user.password);

      if (!isTruePassword) {
        throw new Exception(ErrorCode.Email_Or_Password_Not_valid, 'Password not true');
      }

      return await this.generateToken(userRepository, user);
    });
  }

  async register({ email, password }: RegisterAuthDto) {
    return await getConnection().transaction(async (transaction) => {
      const userRepository = transaction.getRepository(User);

      const hasEmail = await this.isEmailExist(email, userRepository);

      if (hasEmail) {
        throw new Exception(ErrorCode.Email_Already_Exist, 'This email address already exist.');
      }

      const hashedPassword = await hash(password, config.auth.rounds);

      const user = await userRepository.save({ email, password: hashedPassword });

      return await this.generateToken(userRepository, user);
    });
  }

  async requestAccessToken({ refreshToken }: RequestAccessTokenDto) {
    const payload = this.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new Exception(
        ErrorCode.Refresh_Token_Invalid,
        'Your refresh token invalid. Please login again.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { id: payload.id }, select: ['id', 'refreshToken'] });

    return await this.generateToken(userRepository, user);
  }

  async isEmailExist(email: string, userRepository?: Repository<User>) {
    userRepository = userRepository ?? getRepository(User);

    const isExist = await userRepository.findOne({ where: { email }, select: ['id'] });

    return !!isExist;
  }

  async generateToken(userRepository: Repository<User>, user: User) {
    const payload = { id: user.id, userType: UserType.USER };
    const refreshToken = user.refreshToken;

    const token = this.generateAccessToken(payload);

    const isValidRefreshToken = this.verifyRefreshToken(user.refreshToken);

    if (!isValidRefreshToken) {
      const newRefreshToken = this.generateRefreshToken(payload);
      await userRepository.update(user.id, { refreshToken: newRefreshToken });

      return { token, refreshToken: newRefreshToken };
    }

    return { token, refreshToken };
  }

  generateAccessToken(payload: any): string {
    Object.assign(payload, { tokenType: JWTType.ACCESS_TOKEN });

    return this.jwtService.sign(payload, {
      expiresIn: config.auth.accessTokenExpiresIn,
    });
  }

  generateRefreshToken(payload: any): string {
    Object.assign(payload, { tokenType: JWTType.REFRESH_TOKEN });

    return this.jwtService.sign(payload, {
      expiresIn: config.auth.refreshTokenExpiresIn,
    });
  }

  verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken);
      return payload?.tokenType === JWTType.ACCESS_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return payload?.tokenType === JWTType.REFRESH_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }
}
