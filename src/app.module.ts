import cors from 'cors';
import helmet from 'helmet';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '$middlewares/logger.middleware';
import { AllExceptionsFilter } from '$helpers/http-exception.filter';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthenticationModule } from '$app/authentication/authentication.module';
import { AuthenticationMiddleware } from '$middlewares/authentication.middleware';
import { TransformResponseInterceptor } from '$helpers/transform.interceptor';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forRoot(), JwtModule.register({}), AuthenticationModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors, helmet, LoggerMiddleware).forRoutes('*');

    consumer
      .apply(AuthenticationMiddleware)
      .exclude('authentication/(login|register|request-access-token)')
      .forRoutes('*');
  }
}
