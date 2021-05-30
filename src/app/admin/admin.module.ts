import { Module } from '@nestjs/common';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { TestAuthModule } from './test-auth/test-auth.module';

@Module({
  imports: [AdminAuthModule, TestAuthModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
