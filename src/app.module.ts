import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '$middlewares/logger.middleware';
import { AllExceptionsFilter } from '$helpers/http-exception.filter';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TransformResponseInterceptor } from '$helpers/transform.interceptor';
import { AuthModule } from '$app/auth/auth.module';
import { AppController } from '$app/auth/auth.controller';
import { JwtAuthGuard } from '$app/auth/jwt-auth.guard';
import { RolesGuard } from '$app/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule],
  controllers: [AppController],
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
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
