import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';

import { AppModule } from '@app/app.module';
import { setupSwagger } from '@http/config/swagger.config';
import type { AppConfig } from '@http/config/app.config';
import { ResponseTimeInterceptor } from '@http/interceptors/response-time.interceptor';

export class AppBootstrapFactory {
  static async create(): Promise<NestFastifyApplication> {
    const fastifyAdapter = new FastifyAdapter({
      logger: false,
      trustProxy: true,
    });

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      fastifyAdapter,
    );

    app.setGlobalPrefix('v1');
    app.enableShutdownHooks();

    await this.registerPlugins(app);
    this.configurePipes(app);
    this.configureInterceptors(app);
    this.configureCors(app);
    setupSwagger(app);

    return app;
  }

  private static async registerPlugins(
    app: NestFastifyApplication,
  ): Promise<void> {
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');

    await app.register(helmet, {
      contentSecurityPolicy: false,
    });

    await app.register(cookie, {
      parseOptions: {
        httpOnly: true,
        sameSite: 'strict',
      },
    });

    await app.register(compress);

    await app.register(rateLimit, {
      max: appConfig?.rateLimit.max ?? 100,
      timeWindow: appConfig?.rateLimit.timeWindow ?? '1 minute',
    });
  }

  private static configurePipes(app: INestApplication): void {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
  }

  private static configureInterceptors(app: INestApplication): void {
    app.useGlobalInterceptors(app.get(ResponseTimeInterceptor));
  }

  private static configureCors(app: INestApplication): void {
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');

    if (!appConfig) {
      throw new Error('App configuration could not be loaded for CORS');
    }

    app.enableCors({
      origin: appConfig.frontendUrl,
      credentials: true,
    });
  }
}
