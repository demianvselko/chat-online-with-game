import { registerAs } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';

type NodeEnv = 'development' | 'local' | 'production' | 'staging' | 'test';

export const appConfig = registerAs('app', () => {
  const portEnv = Number(process.env.PORT ?? 4000);
  const port = Number.isNaN(portEnv) ? 4000 : portEnv;

  const rateLimitMaxEnv = Number(process.env.RATE_LIMIT_MAX ?? 100);
  const rateLimitMax = Number.isNaN(rateLimitMaxEnv) ? 100 : rateLimitMaxEnv;

  const rateLimitWindow = process.env.RATE_LIMIT_WINDOW ?? '1 minute';

  return {
    port,
    host: process.env.HOST ?? '0.0.0.0',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    nodeEnv: (process.env.NODE_ENV ?? 'development') as NodeEnv,
    rateLimit: {
      max: rateLimitMax,
      timeWindow: rateLimitWindow,
    },
  };
});

export type AppConfig = ConfigType<typeof appConfig>;
