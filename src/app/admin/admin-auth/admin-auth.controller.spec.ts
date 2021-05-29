import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from '../admin-auth/admin-auth.controller';
import { AdminAuthService } from '../admin-auth/admin-auth.service';

describe('AdminAuthController', () => {
  let controller: AdminAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [AdminAuthService],
    }).compile();

    controller = module.get<AdminAuthController>(AdminAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
