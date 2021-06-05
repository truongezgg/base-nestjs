import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';

const token = 'dummy token';
const refreshToken = 'dummy refresh token';

describe('AdminAuthController', () => {
  let controller: AdminAuthController;
  let service: AdminAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      // If you've looked at the complex sample you'll notice that these functions
      // are a little bit more in depth using mock implementation
      // to give us a little bit more control and flexibility in our tests
      // this is not necessary, but can sometimes be helpful in a test scenario
      providers: [
        {
          provide: AdminAuthService,
          useValue: {
            login: jest.fn().mockImplementation((email: string, password: string) => {
              return Promise.resolve({ token, refreshToken });
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminAuthController>(AdminAuthController);
    service = module.get<AdminAuthService>(AdminAuthService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login', () => {
    it('should get token and refresh token', async () => {
      await expect(controller.login({ email: 'truongezgg@gmail.com', password: '123456' })).resolves.toEqual({
        token,
        refreshToken,
      });
    });
  });
});
