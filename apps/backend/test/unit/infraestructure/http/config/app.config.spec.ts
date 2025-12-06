import { appConfig } from '@http/config/app.config';

describe('appConfig', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should return defaults when no env variables are set', () => {
    delete process.env.PORT;
    delete process.env.HOST;
    delete process.env.FRONTEND_URL;
    delete process.env.NODE_ENV;
    delete process.env.RATE_LIMIT_MAX;
    delete process.env.RATE_LIMIT_WINDOW;

    const config = appConfig();

    expect(config).toEqual({
      port: 4000,
      host: '0.0.0.0',
      frontendUrl: 'http://localhost:3000',
      nodeEnv: 'development',
      rateLimit: {
        max: 100,
        timeWindow: '1 minute',
      },
    });
  });

  it('should use env variables when they are provided', () => {
    process.env.PORT = '8080';
    process.env.HOST = '127.0.0.1';
    process.env.FRONTEND_URL = 'https://frontend.example.com';
    process.env.NODE_ENV = 'production';
    process.env.RATE_LIMIT_MAX = '250';
    process.env.RATE_LIMIT_WINDOW = '5 minutes';

    const config = appConfig();

    expect(config).toEqual({
      port: 8080,
      host: '127.0.0.1',
      frontendUrl: 'https://frontend.example.com',
      nodeEnv: 'production',
      rateLimit: {
        max: 250,
        timeWindow: '5 minutes',
      },
    });
  });

  it('should fallback to defaults when numeric envs are invalid', () => {
    process.env.PORT = 'invalid';
    process.env.RATE_LIMIT_MAX = 'invalid';

    delete process.env.HOST;
    delete process.env.FRONTEND_URL;
    delete process.env.NODE_ENV;
    delete process.env.RATE_LIMIT_WINDOW;

    const config = appConfig();

    expect(config).toEqual({
      port: 4000,
      host: '0.0.0.0',
      frontendUrl: 'http://localhost:3000',
      nodeEnv: 'development',
      rateLimit: {
        max: 100,
        timeWindow: '1 minute',
      },
    });
  });
});
