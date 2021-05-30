import { Module } from '@nestjs/common';
import { TestAuthService } from './test-auth.service';
import { TestAuthController } from './test-auth.controller';

@Module({
  controllers: [TestAuthController],
  providers: [TestAuthService]
})
export class TestAuthModule {}
