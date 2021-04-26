import { CustomHttpException } from '$helpers/exception';
import { AuthenticationType, ErrorCode } from '$types/enums';
import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, getConnection, getRepository, Repository } from 'typeorm';
import { RegisterAuthenticationDto, LoginAuthenticationDto, RequestAccessTokenDto } from './dto/authentication.dto';
import User from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import config from '$config';
import { compare, hash } from 'bcrypt';
import { IPayload } from '$types/interfaces';

export interface IToken {
  token: string;
  refreshToken: string;
}

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  async login({ email, password }: LoginAuthenticationDto): Promise<IToken> {
    return await getConnection().transaction(async (transaction: EntityManager) => {
      const userRepository = transaction.getRepository(User);

      const user = await userRepository.findOne({ where: { email }, select: ['id', 'password', 'refreshToken'] });

      if (!user) {
        throw new CustomHttpException({
          errorCode: ErrorCode.Email_Or_Password_Not_valid,
          devMessage: 'Email address not exist.',
        });
      }

      const isTruePassword = await compare(password, user.password);

      if (!isTruePassword) {
        throw new CustomHttpException({
          errorCode: ErrorCode.Email_Or_Password_Not_valid,
          devMessage: 'Password not true',
        });
      }

      return await this.generateToken(userRepository, user);
    });
  }

  async register({ email, password }: RegisterAuthenticationDto) {
    return await getConnection().transaction(async (transaction) => {
      const userRepository = transaction.getRepository(User);

      const hasEmail = await this.isEmailExist(email, userRepository);

      if (hasEmail) {
        throw new CustomHttpException({
          errorCode: ErrorCode.Email_Already_Exist,
          devMessage: 'This email address already exist.',
        });
      }

      const hashedPassword = await hash(password, config.authentication.rounds);

      const user = await userRepository.save({ email, password: hashedPassword });

      return await this.generateToken(userRepository, user);
    });
  }

  async requestAccessToken({ refreshToken }: RequestAccessTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: config.authentication.refreshTokenSecret,
        algorithms: ['HS256'],
      });

      const userRepository = getRepository(User);

      const user = await userRepository.findOne({ where: { id: payload.id }, select: ['id', 'refreshToken'] });

      return await this.generateToken(userRepository, user);
    } catch (error) {
      throw new CustomHttpException({
        errorCode: ErrorCode.Refresh_Token_Invalid,
        status: HttpStatus.UNAUTHORIZED,
        devMessage: 'Your refresh token invalid. Please login again.',
      });
    }
  }

  async isEmailExist(email: string, userRepository?: Repository<User>) {
    userRepository = userRepository ?? getRepository(User);

    const isExist = await userRepository.findOne({ where: { email }, select: ['id'] });

    return !!isExist;
  }

  async generateToken(userRepository: Repository<User>, user: User): Promise<IToken> {
    const payload = { id: user.id, type: AuthenticationType.User };
    const refreshToken = user.refreshToken;

    const token = this.generateAccessToken(payload);

    try {
      this.jwtService.verify(refreshToken, {
        secret: config.authentication.refreshTokenSecret,
        algorithms: ['HS256'],
      });

      return { token, refreshToken };
    } catch (error) {
      const newRefreshToken = this.generateRefreshToken(payload);
      await userRepository.update(user.id, { refreshToken: newRefreshToken });

      return { token, refreshToken: newRefreshToken };
    }
  }

  generateAccessToken(payload: IPayload): string {
    return this.jwtService.sign(payload, {
      secret: config.authentication.accessTokenSecret,
      expiresIn: '600s',
      algorithm: 'HS256',
    });
  }

  generateRefreshToken(payload: IPayload): string {
    return this.jwtService.sign(payload, {
      secret: config.authentication.refreshTokenSecret,
      expiresIn: '30d',
      algorithm: 'HS256',
    });
  }
}
