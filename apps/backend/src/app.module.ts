import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from '@http/config/app.config';
import { HealthController } from '@http/controllers/health.controller';
import { ResponseTimeInterceptor } from '@http/interceptors/response-time.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
  ],
  controllers: [HealthController],
  providers: [ResponseTimeInterceptor],
})
export class AppModule {}
