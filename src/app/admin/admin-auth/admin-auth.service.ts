import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CONFIG from '$config';
import { UserType, ErrorCode, JWTType } from '$types/enums';
import { EntityManager, getConnection, getRepository, Repository } from 'typeorm';
import User from '$database/entities/User';
import { Exception } from '$helpers/exception';
import { compare, hash } from 'bcrypt';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminRefreshTokenDto } from './dto/admin-refresh-token.dto';
import { AuthService } from '$shared/auth/auth.service';

@Injectable()
export class AdminAuthService {
  constructor(private authService: AuthService) {}

  async login({ email, password }) {
    return await getConnection().transaction(async (transaction: EntityManager) => {
      const userRepository = transaction.getRepository(User);

      const user = await userRepository.findOne({ where: { email }, select: ['id', 'password', 'refreshToken'] });
      if (!user) throw new Exception(ErrorCode.Email_Or_Password_Not_valid);

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) throw new Exception(ErrorCode.Email_Or_Password_Not_valid, 'Password not true');

      return await this.generateToken(userRepository, user);
    });
  }

  async register({ email, password }: AdminRegisterDto) {
    return await getConnection().transaction(async (transaction) => {
      const userRepository = transaction.getRepository(User);

      const isAnyUserHasEmail = await this.checkIsAnyUserHasEmail(email, userRepository);
      if (isAnyUserHasEmail) throw new Exception(ErrorCode.Email_Already_Exist);

      const hashedPassword = await hash(password, CONFIG.BCRYPT_HASH_ROUNDS);
      const user = await userRepository.save({ email, password: hashedPassword });

      return await this.generateToken(userRepository, user);
    });
  }

  async refreshToken({ refreshToken }: AdminRefreshTokenDto) {
    const userRepository = getRepository(User);

    const payload = this.authService.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new Exception(ErrorCode.Refresh_Token_Invalid, 'Invalid refresh token.', HttpStatus.UNAUTHORIZED);
    }

    const user = await userRepository.findOne({ where: { id: payload.id }, select: ['id', 'refreshToken'] });

    return await this.generateToken(userRepository, user);
  }

  async checkIsAnyUserHasEmail(email: string, userRepository?: Repository<User>) {
    userRepository = userRepository ?? getRepository(User);

    const isExist = await userRepository.findOne({ where: { email }, select: ['id'] });
    return !!isExist;
  }

  async generateToken(userRepository: Repository<User>, user: User) {
    const payload = { id: user.id, userType: UserType.ADMIN };
    const refreshToken = user.refreshToken;

    const token = this.authService.generateAccessToken(payload);

    const isValidRefreshToken = this.authService.verifyRefreshToken(user.refreshToken);

    if (!isValidRefreshToken) {
      const newRefreshToken = this.authService.generateRefreshToken(payload);
      await userRepository.update(user.id, { refreshToken: newRefreshToken });

      return { token, refreshToken: newRefreshToken };
    }

    return { token, refreshToken };
  }
}
