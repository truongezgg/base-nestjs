import { Module } from '@nestjs/common';
import { ConfigModule, LanguageModule, ResourceModule, AuthorizationModule } from './index';

@Module({
  imports: [ConfigModule, AuthorizationModule, ResourceModule, LanguageModule],
  controllers: [],
  exports: [ConfigModule, AuthorizationModule, ResourceModule, LanguageModule],
})
export class CommonModule {}
