import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  exports: [AuthModule],
})
export class SharedModule {}
