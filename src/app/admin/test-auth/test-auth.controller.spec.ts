import { Test, TestingModule } from '@nestjs/testing';
import { TestAuthController } from './test-auth.controller';
import { TestAuthService } from './test-auth.service';

describe('TestAuthController', () => {
  let controller: TestAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestAuthController],
      providers: [TestAuthService],
    }).compile();

    controller = module.get<TestAuthController>(TestAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
