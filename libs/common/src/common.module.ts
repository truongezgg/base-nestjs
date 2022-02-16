import { Module } from '@nestjs/common';
import { ConfigModule, LanguageModule, ResourceModule, AuthorizationModule } from './index';

@Module({
  imports: [ConfigModule, AuthorizationModule, ResourceModule, LanguageModule],
  controllers: [],
  exports: [AuthorizationModule, ConfigModule],
})
export class CommonModule {}
