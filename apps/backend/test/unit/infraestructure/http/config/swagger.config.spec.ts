import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

import { setupSwagger } from '@http/config/swagger.config';
import type { AppConfig } from '@http/config/app.config';

import {
  createConfigServiceMock,
  type ConfigServiceMock,
  asConfigServiceInstance,
} from '@mocks/config-service.mock';
import {
  createNestFastifyAppMock,
  type NestFastifyApplicationMock,
} from '@mocks/nest-fastify-app.mock';

type SwaggerConfigSnapshot = {
  title?: string;
  description?: string;
  version?: string;
};

const lastConfig: SwaggerConfigSnapshot = {};

jest.mock('@nestjs/swagger', () => {
  const createDocument = jest
    .fn()
    .mockImplementation((_app: unknown, config: unknown) => ({
      document: true,
      config,
    }));

  const setup = jest.fn();

  const DocumentBuilderMock = jest.fn().mockImplementation(() => {
    const instance: any = {
      setTitle: (title: string) => {
        lastConfig.title = title;
        return instance;
      },
      setDescription: (description: string) => {
        lastConfig.description = description;
        return instance;
      },
      setVersion: (version: string) => {
        lastConfig.version = version;
        return instance;
      },
      addBearerAuth: () => instance,
      build: () => ({ ...lastConfig }),
    };

    return instance;
  });

  return {
    SwaggerModule: {
      createDocument,
      setup,
    },
    DocumentBuilder: DocumentBuilderMock,
  };
});

describe('setupSwagger', () => {
  let appMock: NestFastifyApplicationMock;
  let appInstance: any;
  let configServiceMock: ConfigServiceMock;
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    ({ appMock, appInstance } = createNestFastifyAppMock());
    configServiceMock = createConfigServiceMock();

    appMock.get.mockImplementation((token: unknown) => {
      if (token === ConfigService) {
        return asConfigServiceInstance(configServiceMock);
      }
      return undefined;
    });

    process.env = { ...ORIGINAL_ENV };

    lastConfig.title = undefined;
    lastConfig.description = undefined;
    lastConfig.version = undefined;

    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.clearAllMocks();
  });

  it('should not setup Swagger in production environment', () => {
    const appConfig: Partial<AppConfig> = {
      nodeEnv: 'production',
    };

    configServiceMock.get.mockImplementation((key: string) => {
      if (key === 'app') {
        return appConfig;
      }
      return undefined;
    });

    setupSwagger(appInstance);

    expect(SwaggerModule.createDocument).not.toHaveBeenCalled();
    expect(SwaggerModule.setup).not.toHaveBeenCalled();
  });

  it('should setup Swagger with custom env values when not in production', () => {
    const appConfig: Partial<AppConfig> = {
      nodeEnv: 'development',
    };

    configServiceMock.get.mockImplementation((key: string) => {
      if (key === 'app') return appConfig;
      if (key === 'SWAGGER_NAME') return 'My API';
      if (key === 'SWAGGER_DESCRIPTION') return 'My API Description';
      if (key === 'SWAGGER_VERSION') return '2.0.0';
      return undefined;
    });

    process.env.npm_package_version = '9.9.9';

    setupSwagger(appInstance);

    expect(SwaggerModule.createDocument).toHaveBeenCalledTimes(1);
    expect(SwaggerModule.setup).toHaveBeenCalledTimes(1);

    expect(lastConfig.title).toBe('My API');
    expect(lastConfig.description).toBe('My API Description');
    expect(lastConfig.version).toBe('2.0.0');
  });

  it('should fallback to npm_package_version when SWAGGER_VERSION is not set', () => {
    const appConfig: Partial<AppConfig> = {
      nodeEnv: 'development',
    };

    configServiceMock.get.mockImplementation((key: string) => {
      if (key === 'app') return appConfig;
      if (key === 'SWAGGER_NAME') return undefined;
      if (key === 'SWAGGER_DESCRIPTION') return undefined;
      if (key === 'SWAGGER_VERSION') return undefined;
      return undefined;
    });

    process.env.npm_package_version = '3.4.5';

    setupSwagger(appInstance);

    expect(lastConfig.title).toBe('Backend API');
    expect(lastConfig.description).toBe('API documentation');
    expect(lastConfig.version).toBe('3.4.5');
  });

  it('should fallback to 1.0.0 when SWAGGER_VERSION and npm_package_version are not set', () => {
    const appConfig: Partial<AppConfig> = {
      nodeEnv: 'development',
    };

    configServiceMock.get.mockImplementation((key: string) => {
      if (key === 'app') return appConfig;
      if (key === 'SWAGGER_NAME') return undefined;
      if (key === 'SWAGGER_DESCRIPTION') return undefined;
      if (key === 'SWAGGER_VERSION') return undefined;
      return undefined;
    });

    delete process.env.npm_package_version;

    setupSwagger(appInstance);

    expect(lastConfig.title).toBe('Backend API');
    expect(lastConfig.description).toBe('API documentation');
    expect(lastConfig.version).toBe('1.0.0');
  });
});
