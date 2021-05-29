import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth/admin-auth.controller';
import { AdminAuthService } from './admin-auth/admin-auth.service';
import { AuthModule } from '$app/shared/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminModule {}
