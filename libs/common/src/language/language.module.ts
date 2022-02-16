import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Language from './entities/Language';
import LanguageEnv from './entities/LanguageEnv';
import LanguageKey from './entities/LanguageKey';
import LanguageTranslation from './entities/LanguageTranslation';
import { ConfigModule } from '@app/common/config';

@Module({
  imports: [TypeOrmModule.forFeature([Language, LanguageEnv, LanguageKey, LanguageTranslation]), ConfigModule],
  providers: [LanguageService],
  controllers: [LanguageController],
})
export class LanguageModule {}
