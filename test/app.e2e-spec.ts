require('dotenv').config();
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '$database/entities/User';
import { AdminModule } from '$app/admin/admin.module';
import { ClientModule } from '$app/client/client.module';
import { JwtAuthGuard } from '$app/shared/auth/jwt-auth.guard';
import { PermissionsGuard } from '$app/shared/authorization/permissions.guard';
import { SharedModule } from '$app/shared/shared.module';
import { TransformResponseInterceptor } from '$core/interceptors/transform-res.interceptor';
import { AllExceptionsFilter } from '$helpers/http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AuthService } from '$app/shared/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { IToken } from '$types/interfaces';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '$app/shared/auth/jwt.strategy';

describe('App (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let token: string;
  let refreshToken: string;

  const ADMIN_EMAIL = 'truongezgg@gmail.com';
  const ADMIN_PASSWORD = '123456';
  const DUMMY_EMAIL = 'dummy_email1234567890987654321@gmail.com';
  const DUMMY_PASSWORD = 'dummy_password';
  const DUMMY_REEFRESH_TOKEN = 'dummy_refresh_token';

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
          supportBigNumbers: true,
          synchronize: false, // Alway use migration.
          logging: false,
          charset: 'utf8mb4',
          entities: [User],
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

    authService = module.get<AuthService>(AuthService);
    await module.init();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * START AUTHENTICATION
   * 1. Login
   * 2. Refresh token
   * 3. Check email address exists
   */
  describe('Admin Authentication', () => {
    describe('(POST)/admin-auth/login', () => {
      let data: IToken;

      test('Validate working correctly', async () => {
        // Invalid email format
        await request(app.getHttpServer())
          .post('/admin-auth/login')
          .send({ email: 'invalid_format_email', password: ADMIN_PASSWORD })
          .expect(422);

        // Password too short(minLength 6)
        await request(app.getHttpServer())
          .post('/admin-auth/login')
          .send({ email: ADMIN_EMAIL, password: '12345' })
          .expect(422);

        // Password too long(maxLength 32)
        await request(app.getHttpServer())
          .post('/admin-auth/login')
          .send({ email: ADMIN_EMAIL, password: '012345678901234567890123456789122' })
          .expect(422);

        // Missing email addres in reuest body
        await request(app.getHttpServer()).post('/admin-auth/login').send({ password: DUMMY_PASSWORD }).expect(422);

        // Missing password in reuest body
        await request(app.getHttpServer()).post('/admin-auth/login').send({ email: ADMIN_EMAIL }).expect(422);
      });

      test('Loggin success with status code 201.', async () => {
        const response = await request(app.getHttpServer())
          .post('/admin-auth/login')
          .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
          .expect(201);

        data = response.body?.data;
      });

      test('Response body contain token & refreshToken', async () => {
        expect(data).toEqual({
          token: expect.any(String),
          refreshToken: expect.any(String),
        });

        // Login API return valid token.
        expect(authService.verifyAccessToken(data.token)).toBeTruthy();
        expect(authService.verifyRefreshToken(data.refreshToken)).toBeTruthy();

        token = data.token;
        refreshToken = data.refreshToken;
      });

      test('Email or password incorrect. Failed with status 400', async () => {
        // Failed with email invalid
        await request(app.getHttpServer())
          .post('/admin-auth/login')
          .send({ email: DUMMY_EMAIL, password: ADMIN_PASSWORD })
          .expect(400);

        // Failed with password invalid
        await request(app.getHttpServer())
          .post('/admin-auth/login')
          .send({ email: ADMIN_EMAIL, password: DUMMY_PASSWORD })
          .expect(400);
      });
    });

    describe('(POST)/admin-auth/refresh-token', () => {
      let data: IToken;

      test('Validate working correctly', async () => {
        // Not provided refreshToken
        await request(app.getHttpServer()).post('/admin-auth/refresh-token').send({}).expect(422);

        // Provided invalid refreshToken
        await request(app.getHttpServer()).post('/admin-auth/refresh-token').send({ refreshToken: null }).expect(422);
      });

      test('Get new token by refresh token', async () => {
        // Status code expect 201 Created
        const response = await request(app.getHttpServer())
          .post('/admin-auth/refresh-token')
          .send({ refreshToken })
          .expect(201);

        data = response.body?.data;
      });

      test('New access token is valid', async () => {
        expect(data).toEqual({
          token: expect.any(String),
        });

        expect(authService.verifyAccessToken(data.token)).toBeTruthy();
      });

      test('Refresh token invalid or expired. Failed with status 401', async () => {
        // Status code expect 201 Created
        const response = await request(app.getHttpServer())
          .post('/admin-auth/refresh-token')
          .send({ refreshToken: DUMMY_REEFRESH_TOKEN })
          .expect(401);

        data = response.body?.data;
      });
    });

    describe('(GET)/admin-auth/is-email-exists', () => {
      let data: { isEmailExists: Boolean };

      /**
       * 1.Provided Incorrect email address
       * 2.Missing email address
       */
      test('Validate working correctly', async () => {
        // Provided Incorrect email address
        await request(app.getHttpServer())
          .get('/admin-auth/is-email-exists')
          .query({ email: 'Incorrect_Email_Address' })
          .expect(422);

        // Missing email address
        await request(app.getHttpServer()).get('/admin-auth/is-email-exists').query({}).expect(422);
      });

      test('Provided email exists => isEmailExists: true', async () => {
        // Case email exists
        const response = await request(app.getHttpServer())
          .get('/admin-auth/is-email-exists')
          .query({ email: ADMIN_EMAIL })
          .expect(200);

        data = response.body?.data;

        expect(data).toEqual({
          isEmailExists: expect.any(Boolean),
        });

        // Email exist.
        expect(data.isEmailExists).toBeTruthy();
      });

      test('Provided email not exists => isEmailExists: false', async () => {
        const response = await request(app.getHttpServer())
          .get('/admin-auth/is-email-exists')
          .query({ email: DUMMY_EMAIL })
          .expect(200);

        data = response.body?.data;

        expect(data).toEqual({
          isEmailExists: expect.any(Boolean),
        });

        // Email not exits.
        expect(data.isEmailExists).toBeFalsy();
      });
    });
    /**
     * END AUTHENTICATION
     */
  });
});
