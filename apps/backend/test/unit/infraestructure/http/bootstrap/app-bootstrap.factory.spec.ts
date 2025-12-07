import { ValidationPipe } from '@nestjs/common';
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

import { AppModule } from '@src/app.module';
import { ResponseTimeInterceptor } from '@http/interceptors/response-time.interceptor';
import type { AppConfig } from '@http/config/app.config';
import { setupSwagger } from '@http/config/swagger.config';

import {
  asConfigServiceInstance,
  ConfigServiceMock,
  createConfigServiceMock,
} from '@mocks/config-service.mock';
import {
  createNestFastifyAppMock,
  NestFastifyApplicationMock,
} from '@mocks/nest-fastify-app.mock';
import { AppBootstrapFactory } from '@infra/http/bootstrap/app-bootstrap.factory';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('@fastify/helmet', () => jest.fn());
jest.mock('@fastify/cookie', () => jest.fn());
jest.mock('@fastify/compress', () => jest.fn());
jest.mock('@fastify/rate-limit', () => jest.fn());

jest.mock('@http/config/swagger.config', () => ({
  setupSwagger: jest.fn(),
}));

describe('AppBootstrapFactory', () => {
  let appMock: NestFastifyApplicationMock;
  let appInstance: NestFastifyApplication;
  let configServiceMock: ConfigServiceMock;

  beforeEach(() => {
    ({ appMock, appInstance } = createNestFastifyAppMock());
    configServiceMock = createConfigServiceMock();

    appMock.get.mockImplementation((token: unknown) => {
      if (token === ConfigService) {
        return asConfigServiceInstance(configServiceMock);
      }
      if (token === ResponseTimeInterceptor) {
        return {} as ResponseTimeInterceptor;
      }
      return undefined;
    });

    (NestFactory.create as jest.Mock).mockResolvedValue(appInstance);
    (setupSwagger as jest.Mock).mockImplementation(() => undefined);

    const appConfig: AppConfig = {
      port: 4000,
      frontendUrl: 'http://localhost:3000',
      rateLimit: {
        max: 200,
        timeWindow: '2 minutes',
      },
      host: '',
      nodeEnv: 'development',
    };

    configServiceMock.get.mockReturnValue(appConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap the app with fastify and configure global settings', async () => {
    const app = await AppBootstrapFactory.create();

    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    const [moduleArg, adapterArg] = (NestFactory.create as jest.Mock).mock
      .calls[0];

    expect(moduleArg).toBe(AppModule);
    expect(adapterArg).toBeInstanceOf(FastifyAdapter);

    expect(appMock.setGlobalPrefix).toHaveBeenCalledWith('v1');
    expect(appMock.enableShutdownHooks).toHaveBeenCalled();

    expect(appMock.register).toHaveBeenCalledWith(helmet, {
      contentSecurityPolicy: false,
    });

    expect(appMock.register).toHaveBeenCalledWith(cookie, {
      parseOptions: {
        httpOnly: true,
        sameSite: 'strict',
      },
    });

    expect(appMock.register).toHaveBeenCalledWith(compress);

    expect(appMock.register).toHaveBeenCalledWith(rateLimit, {
      max: 200,
      timeWindow: '2 minutes',
    });

    expect(appMock.useGlobalPipes).toHaveBeenCalledTimes(1);
    const pipeArg = appMock.useGlobalPipes.mock.calls[0][0];
    expect(pipeArg).toBeInstanceOf(ValidationPipe);

    expect(appMock.useGlobalInterceptors).toHaveBeenCalledTimes(1);
    expect(appMock.useGlobalInterceptors.mock.calls[0][0]).toBeDefined();

    expect(appMock.enableCors).toHaveBeenCalledWith({
      origin: 'http://localhost:3000',
      credentials: true,
    });

    expect(setupSwagger).toHaveBeenCalledWith(app);

    expect(app).toBe(appInstance);
  });

  it('should use default rate limit values when appConfig.rateLimit is missing', async () => {
    const appConfig = {
      port: 4000,
      frontendUrl: 'http://localhost:3000',
    } as AppConfig;

    configServiceMock.get.mockReturnValue(appConfig);

    await AppBootstrapFactory.create();

    expect(appMock.register).toHaveBeenCalledWith(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
    });
  });

  it('should throw if appConfig is missing when configuring CORS', async () => {
    configServiceMock.get.mockReturnValue(undefined);

    await expect(AppBootstrapFactory.create()).rejects.toThrow(
      'App configuration could not be loaded for CORS',
    );

    expect(appMock.enableCors).not.toHaveBeenCalled();
  });
});
