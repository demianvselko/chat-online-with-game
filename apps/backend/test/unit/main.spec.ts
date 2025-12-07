import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppBootstrapFactory } from '@http/bootstrap/app-bootstrap.factory';
import type { AppConfig } from '@http/config/app.config';
import {
  createNestFastifyAppMock,
  type NestFastifyApplicationMock,
} from '@mocks/nest-fastify-app.mock';
import {
  createConfigServiceMock,
  type ConfigServiceMock,
  asConfigServiceInstance,
} from '@mocks/config-service.mock';
import { bootstrap } from '@src/main';

jest.mock('@http/bootstrap/app-bootstrap.factory', () => ({
  AppBootstrapFactory: {
    create: jest.fn(),
  },
}));

describe('bootstrap (unit)', () => {
  let appMock: NestFastifyApplicationMock & {
    listen: jest.Mock;
    getUrl: jest.Mock;
  };
  let appInstance: any;
  let configServiceMock: ConfigServiceMock;
  const originalLoggerLog = Logger.prototype.log;
  const originalLoggerError = Logger.prototype.error;

  beforeEach(() => {
    const result = createNestFastifyAppMock();
    appMock = result.appMock as NestFastifyApplicationMock & {
      listen: jest.Mock;
      getUrl: jest.Mock;
    };
    appInstance = result.appInstance;
    appMock.listen = jest.fn().mockResolvedValue(undefined);
    appMock.getUrl = jest.fn().mockResolvedValue('http://127.0.0.1:5555');
    configServiceMock = createConfigServiceMock();
    appMock.get.mockImplementation((token: unknown) => {
      if (token === ConfigService) {
        return asConfigServiceInstance(configServiceMock);
      }
      return undefined;
    });
    jest
      .spyOn(AppBootstrapFactory, 'create')
      .mockResolvedValue(appInstance as never);
    Logger.prototype.log = jest.fn();
    Logger.prototype.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    Logger.prototype.log = originalLoggerLog;
    Logger.prototype.error = originalLoggerError;
  });

  it('should bootstrap app, listen on configured host/port and log final url', async () => {
    const appConfig: Partial<AppConfig> = {
      port: 5555,
      host: '127.0.0.1',
    };
    configServiceMock.get.mockImplementation((key: string) => {
      if (key === 'app') return appConfig;
      return undefined;
    });
    await bootstrap();
    expect(AppBootstrapFactory.create).toHaveBeenCalledTimes(1);
    expect(appMock.listen).toHaveBeenCalledWith(5555, '127.0.0.1');
    expect(appMock.getUrl).toHaveBeenCalledTimes(1);
    expect(Logger.prototype.log as jest.Mock).toHaveBeenCalledWith(
      'Backend started at http://127.0.0.1:5555',
    );
  });

  it('should log error and throw when appConfig is missing', async () => {
    configServiceMock.get.mockImplementation((key: string) => {
      if (key === 'app') return undefined;
      return undefined;
    });
    await expect(bootstrap()).rejects.toThrow(
      'App configuration could not be loaded',
    );
    expect(Logger.prototype.error as jest.Mock).toHaveBeenCalledWith(
      'App configuration could not be loaded',
    );
    expect(appMock.listen).not.toHaveBeenCalled();
  });
});
