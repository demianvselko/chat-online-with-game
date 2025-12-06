import type { AppConfig } from '@http/config/app.config';

export type RateLimitOptions = {
  max: number;
  timeWindow: string;
};

export function buildRateLimitOptions(
  appConfig?: AppConfig | null,
): RateLimitOptions {
  return {
    max: appConfig?.rateLimit?.max ?? 100,
    timeWindow: appConfig?.rateLimit?.timeWindow ?? '1 minute',
  };
}

export function ensureAppConfig(
  appConfig: AppConfig | undefined | null,
): AppConfig {
  if (!appConfig) {
    throw new Error('App configuration could not be loaded for CORS');
  }
  return appConfig;
}
