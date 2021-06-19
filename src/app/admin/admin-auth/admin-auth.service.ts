import { HttpStatus, Injectable } from '@nestjs/common';
import config from '$config';
import { UserType, ErrorCode } from '$types/enums';
import { Connection, Repository } from 'typeorm';
import User from '$database/entities/User';
import { Exception, Unauthorized } from '$helpers/exception';
import { compare, hash } from 'bcrypt';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AuthService } from '$shared/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { IToken } from '$types/interfaces';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly connection: Connection,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login({ email, password }): Promise<IToken> {
    const user = await this.userRepository.findOne({ where: { email }, select: ['id', 'password', 'refreshToken'] });
    if (!user) throw new Exception(ErrorCode.Email_Or_Password_Not_valid, 'Email does not exists.');

    const isValid = await compare(password, user.password);
    if (!isValid) throw new Exception(ErrorCode.Email_Or_Password_Not_valid, 'Password incorrect.');

    return await this.generateToken(this.userRepository, user);
  }

  async register({ email, password }: AdminRegisterDto): Promise<IToken> {
    return await this.connection.transaction(async (transaction) => {
      const userRepository = transaction.getRepository(User);

      const isEmailExists = await this.isEmailExists(email, userRepository);
      if (isEmailExists) throw new Exception(ErrorCode.Email_Already_Exist, 'Email alredy exist. Chose an other one!');

      const hashedPassword = await hash(password, config.BCRYPT_HASH_ROUNDS);
      const user = await userRepository.save({ email, password: hashedPassword });

      return await this.generateToken(userRepository, user);
    });
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const payload = this.authService.verifyRefreshToken(refreshToken);
    if (!payload) throw new Unauthorized('You have provided invalid refresh token');

    const user = await this.userRepository.findOne({ where: { id: payload.id }, select: ['id', 'refreshToken'] });

    if (refreshToken !== user.refreshToken) throw new Unauthorized('Your refresh token changed, please login again');

    const result = await this.generateToken(this.userRepository, user);
    return result?.token;
  }

  async isEmailExists(email: string, userRepository?: Repository<User>): Promise<boolean> {
    userRepository = userRepository || this.userRepository;

    const isExist = await userRepository.findOne({ where: { email }, select: ['id'] });
    return !!isExist;
  }

  /**
   * Generate token & refresh token.
   *
   */
  async generateToken(userRepository: Repository<User>, user: User): Promise<IToken> {
    const payload = { id: user.id, userType: UserType.ADMIN };

    const token = this.authService.generateAccessToken(payload);

    const isValid = this.authService.verifyRefreshToken(user.refreshToken);

    if (!isValid) {
      const newRefreshToken = this.authService.generateRefreshToken(payload);

      await userRepository.update(user.id, { refreshToken: newRefreshToken });

      return { token, refreshToken: newRefreshToken };
    }

    return { token, refreshToken: user.refreshToken };
  }
}
