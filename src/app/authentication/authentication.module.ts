import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  imports: [JwtModule.register({})],
})
export class AuthenticationModule {}
