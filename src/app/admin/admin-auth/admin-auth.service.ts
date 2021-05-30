import { HttpStatus, Injectable } from '@nestjs/common';
import config from '$config';
import { UserType, ErrorCode } from '$types/enums';
import { Connection, Repository } from 'typeorm';
import User from '$database/entities/User';
import { Exception } from '$helpers/exception';
import { compare, hash } from 'bcrypt';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AuthService } from '$shared/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly connection: Connection,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login({ email, password }) {
    const user = await this.userRepository.findOne({ where: { email }, select: ['id', 'password', 'refreshToken'] });
    if (!user) throw new Exception(ErrorCode.Email_Or_Password_Not_valid);

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) throw new Exception(ErrorCode.Email_Or_Password_Not_valid, 'Password not true');

    return await this.generateToken(this.userRepository, user);
  }

  async register({ email, password }: AdminRegisterDto) {
    return await this.connection.transaction(async (transaction) => {
      const userRepository = transaction.getRepository(User);

      const isEmailExists = await this.isEmailExists(email, userRepository);
      if (isEmailExists) throw new Exception(ErrorCode.Email_Already_Exist);

      const hashedPassword = await hash(password, config.BCRYPT_HASH_ROUNDS);
      const user = await userRepository.save({ email, password: hashedPassword });

      return await this.generateToken(userRepository, user);
    });
  }

  async refreshToken(refreshToken: string) {
    const payload = this.authService.verifyRefreshToken(refreshToken);
    if (!payload) throw new Exception(ErrorCode.Refresh_Token_Invalid, 'Invalid token.', HttpStatus.UNAUTHORIZED);

    const user = await this.userRepository.findOne({ where: { id: payload.id }, select: ['id', 'refreshToken'] });
    return await this.generateToken(this.userRepository, user);
  }

  async isEmailExists(email: string, userRepository?: Repository<User>) {
    userRepository = userRepository || this.userRepository;

    const isExist = await userRepository.findOne({ where: { email }, select: ['id'] });
    return !!isExist;
  }

  async generateToken(userRepository: Repository<User>, user: User) {
    const payload = { id: user.id, userType: UserType.ADMIN };

    const token = this.authService.generateAccessToken(payload);

    const isValidRefreshToken = this.authService.verifyRefreshToken(user.refreshToken);

    if (!isValidRefreshToken) {
      const newRefreshToken = this.authService.generateRefreshToken(payload);

      await userRepository.update(user.id, { refreshToken: newRefreshToken });

      return { token, refreshToken: newRefreshToken };
    }

    return { token, refreshToken: user.refreshToken };
  }
}
