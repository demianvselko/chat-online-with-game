import type { AppConfig } from '@http/config/app.config';
import {
  buildRateLimitOptions,
  ensureAppConfig,
} from '@infra/http/bootstrap/http-config';

describe('http-config', () => {
  describe('buildRateLimitOptions', () => {
    it('should use rateLimit from appConfig when present', () => {
      const appConfig: AppConfig = {
        port: 4000,
        frontendUrl: 'http://localhost:3000',
        rateLimit: {
          max: 250,
          timeWindow: '5 minutes',
        },
        host: '',
        nodeEnv: 'development',
      };

      const result = buildRateLimitOptions(appConfig);

      expect(result).toEqual({
        max: 250,
        timeWindow: '5 minutes',
      });
    });

    it('should use defaults when appConfig is undefined', () => {
      const result = buildRateLimitOptions(undefined);

      expect(result).toEqual({
        max: 100,
        timeWindow: '1 minute',
      });
    });

    it('should use defaults when rateLimit is missing', () => {
      const appConfig = {
        port: 4000,
        frontendUrl: 'http://localhost:3000',
      } as AppConfig;

      const result = buildRateLimitOptions(appConfig);

      expect(result).toEqual({
        max: 100,
        timeWindow: '1 minute',
      });
    });
  });

  describe('ensureAppConfig', () => {
    it('should return appConfig when defined', () => {
      const appConfig: AppConfig = {
        port: 4000,
        frontendUrl: 'http://localhost:3000',
        rateLimit: {
          max: 100,
          timeWindow: '1 minute',
        },
        host: '',
        nodeEnv: 'development',
      };

      const result = ensureAppConfig(appConfig);

      expect(result).toBe(appConfig);
    });

    it('should throw when appConfig is undefined', () => {
      expect(() => ensureAppConfig(undefined)).toThrow(
        'App configuration could not be loaded for CORS',
      );
    });

    it('should throw when appConfig is null', () => {
      expect(() => ensureAppConfig(null as unknown as AppConfig)).toThrow(
        'App configuration could not be loaded for CORS',
      );
    });
  });
});
