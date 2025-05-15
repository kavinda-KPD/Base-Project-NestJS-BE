import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './infrastructure/controllers/app.controller';
import { AppService } from './application/app.service';
import { ConfigurationModule } from './infrastructure/configurations/base-config/config.module';
import { TypeOrmConfigModule } from './infrastructure/configurations/typeorm-config/typeorm.module';
import { ApplicationStartupHook } from './infrastructure/services/application-startup.hook';
import { UseCaseModule } from './application/use-case.module';
import { AuthModule } from './infrastructure/auth-module/auth.module';
import { RequestLoggerMiddleware } from './infrastructure/common/middlewares/request-response.middlewear';
@Module({
  imports: [
    ConfigurationModule,
    UseCaseModule,
    TypeOrmConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApplicationStartupHook],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
