import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@src/app.module';
import type { AppConfig } from '@http/config/app.config';
import { HealthController } from '@http/controllers/health.controller';
import { ResponseTimeInterceptor } from '@http/interceptors/response-time.interceptor';

describe('AppModule (integration)', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.PORT = '5555';
    process.env.HOST = '127.0.0.1';
    process.env.FRONTEND_URL = 'http://frontend.test';
    process.env.NODE_ENV = 'test';
    process.env.RATE_LIMIT_MAX = '300';
    process.env.RATE_LIMIT_WINDOW = '10 minutes';
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should load app config via ConfigService', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const configService = moduleRef.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');

    expect(appConfig).toEqual({
      port: 5555,
      host: '127.0.0.1',
      frontendUrl: 'http://frontend.test',
      nodeEnv: 'test',
      rateLimit: {
        max: 300,
        timeWindow: '10 minutes',
      },
    });

    await moduleRef.close();
  });

  it('should expose HealthController and ResponseTimeInterceptor', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const healthController = moduleRef.get(HealthController);
    const interceptor = moduleRef.get(ResponseTimeInterceptor);

    expect(healthController).toBeDefined();
    expect(interceptor).toBeDefined();

    await moduleRef.close();
  });
});
