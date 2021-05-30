import { Test, TestingModule } from '@nestjs/testing';
import { TestAuthService } from './test-auth.service';

describe('TestAuthService', () => {
  let service: TestAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestAuthService],
    }).compile();

    service = module.get<TestAuthService>(TestAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
