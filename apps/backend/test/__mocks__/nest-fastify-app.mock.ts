import type { NestFastifyApplication } from '@nestjs/platform-fastify';

export type NestFastifyApplicationMock = {
  register: jest.Mock;
  setGlobalPrefix: jest.Mock;
  enableShutdownHooks: jest.Mock;
  useGlobalPipes: jest.Mock;
  useGlobalInterceptors: jest.Mock;
  enableCors: jest.Mock;
  get: jest.Mock;
};

export function createNestFastifyAppMock(): {
  appMock: NestFastifyApplicationMock;
  appInstance: NestFastifyApplication;
} {
  const appMock: NestFastifyApplicationMock = {
    register: jest.fn(),
    setGlobalPrefix: jest.fn(),
    enableShutdownHooks: jest.fn(),
    useGlobalPipes: jest.fn(),
    useGlobalInterceptors: jest.fn(),
    enableCors: jest.fn(),
    get: jest.fn(),
  };

  const appInstance = appMock as unknown as NestFastifyApplication;

  return { appMock, appInstance };
}
