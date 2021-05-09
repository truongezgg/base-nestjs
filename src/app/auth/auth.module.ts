import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from '$config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      signOptions: { algorithm: 'HS256' },
      secret: config.auth.secretKey,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
