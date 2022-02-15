import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ResourceModule } from './resource/resource.module';
import { LanguageModule } from './language/language.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, AuthorizationModule, ResourceModule, LanguageModule, ConfigModule],
  controllers: [],
  exports: [AuthorizationModule, AuthModule, ConfigModule],
})
export class SharedModule {}
