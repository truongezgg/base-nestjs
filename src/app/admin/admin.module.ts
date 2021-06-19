import { Module } from '@nestjs/common';
import { AdminAuthModule } from './admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [],
  providers: [],
  exports: [AdminAuthModule],
})
export class AdminModule {}
