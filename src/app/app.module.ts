import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '$core/middlewares/logger.middleware';
import { AllExceptionsFilter } from '$core/filters/http-exception.filter';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TransformResponseInterceptor } from '$core/interceptors/transform-res.interceptor';
import { JwtAuthGuard } from '$app/shared/auth/jwt-auth.guard';
import { PermissionsGuard } from '$app/shared/authorization/permissions.guard';
import { SharedModule } from '$shared/shared.module';
import { AdminModule } from '$admin/admin.module';
import { ClientModule } from '$client/client.module';

@Module({
  imports: [TypeOrmModule.forRoot(), SharedModule, AdminModule, ClientModule],
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
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
