require('dotenv').config();
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import User from '$database/entities/User';
import { AdminModule } from '$app/admin/admin.module';
import { ClientModule } from '$app/client/client.module';
import { JwtAuthGuard } from '$app/shared/auth/jwt-auth.guard';
import { PermissionsGuard } from '$app/shared/auth/permissions.guard';
import { SharedModule } from '$app/shared/shared.module';
import { TransformResponseInterceptor } from '$core/interceptors/transform-res.interceptor';
import { AllExceptionsFilter } from '$helpers/http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import Permission from '$database/entities/Permission';
import UserPermission from '$database/entities/UserPermission';
import PermissionGroup from '$database/entities/PermissionGroup';
import Role from '$database/entities/Role';
import RolePermission from '$database/entities/RolePermission';
import { Connection } from 'typeorm';
import { AuthService } from '$app/shared/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IToken } from '$types/interfaces';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '$app/shared/auth/jwt.strategy';

describe('App (e2e)', () => {
  let app: INestApplication;
  let service: AuthService;
  let token: string;
  let refreshToken: string;

  const ADMIN_EMAIL = 'truongezgg@gmail.com';
  const ADMIN_PASSWORD = '123456';
  const timeout = 3000;

  beforeAll(async () => {
    jest.resetModules(); // Most important - it clears the cache
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: Number(process.env.MYSQL_PORT),
          username: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASS,
          database: process.env.MYSQL_NAME,
          supportBigNumbers: false,
          synchronize: true, // Alway use migration.
          logging: true,
          charset: 'utf8mb4',
          migrationsTableName: 'migration',
          entities: [User, Permission, UserPermission, PermissionGroup, Role, RolePermission],
        }),
        SharedModule,
        AdminModule,
        ClientModule,
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: AllExceptionsFilter,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: TransformResponseInterceptor,
        },
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: PermissionsGuard,
        },
      ],
    }).compile();

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule, JwtModule.register({})],
      providers: [AuthService, JwtStrategy],
      exports: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    await module.init();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Admin authentication', () => {
    test('(POST)/admin-auth/login', async () => {
      await request(app.getHttpServer())
        .post('/admin-auth/login')
        .send({ email: 'Invalid email to check validate', password: ADMIN_PASSWORD })
        .expect(422);

      // Status code expect 201 Created
      const data = await request(app.getHttpServer())
        .post('/admin-auth/login')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        .expect(201);

      const body = data.body as { data: IToken };

      expect(body).toEqual({
        data: expect.objectContaining({
          token: expect.any(String),
          refreshToken: expect.any(String),
        }),
      });

      // Verify token and refresh token
      const tokenPayload = service.verifyAccessToken(body.data.token);
      const refreshTokenPayload = service.verifyAccessToken(body.data.token);

      // Login API return valid access token.
      expect(tokenPayload).toBeTruthy();
      expect(refreshTokenPayload).toBeTruthy();

      token = body.data.token;
      refreshToken = body.data.refreshToken;
    });

    test('(POST)/admin-auth/refresh-token', async () => {
      // Status code expect 201 Created
      const data = await request(app.getHttpServer())
        .post('/admin-auth/refresh-token')
        .send({ refreshToken })
        .expect(201);

      const body = data.body as { data: IToken };

      expect(body).toEqual({
        data: expect.objectContaining({
          token: expect.any(String),
        }),
      });

      // Verify token and refresh token
      const tokenPayload = service.verifyAccessToken(body.data.token);

      // Login API return valid access token.
      expect(tokenPayload).toBeTruthy();

      token = body.data.token;
    });

    test('(POST)/admin-auth/is-email-exists', async () => {
      // Check validate
      await request(app.getHttpServer())
        .get('/admin-auth/is-email-exists')
        .query({ email: 'Invalid_Email_Address_To_Test_Validate' })
        .expect(422);

      // Case email exists
      const data = await request(app.getHttpServer())
        .get('/admin-auth/is-email-exists')
        .query({ email: ADMIN_EMAIL })
        .expect(200);

      const body = data.body as { data: { isEmailExists: Boolean } };

      expect(body).toEqual({
        data: expect.objectContaining({
          isEmailExists: expect.any(Boolean),
        }),
      });

      expect(body.data.isEmailExists).toBeTruthy();

      // Case email not exists
      const dummy = await request(app.getHttpServer())
        .get('/admin-auth/is-email-exists')
        .query({ email: 'dummy_email_1234567899876543@dummy.com' })
        .expect(200);

      const dummyBody = dummy.body as { data: { isEmailExists: Boolean } };
      expect(body).toEqual({
        data: expect.objectContaining({
          isEmailExists: expect.any(Boolean),
        }),
      });
      expect(dummyBody.data.isEmailExists).toBeFalsy();
    });
  });
});
