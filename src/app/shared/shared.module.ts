import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [AuthModule, AuthorizationModule],
  controllers: [],
  exports: [AuthorizationModule, AuthModule],
})
export class SharedModule {}
