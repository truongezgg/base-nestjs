import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ResourceModule } from './resource/resource.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [AuthModule, AuthorizationModule, ResourceModule, LanguageModule],
  controllers: [],
  exports: [AuthorizationModule, AuthModule],
})
export class SharedModule {}
