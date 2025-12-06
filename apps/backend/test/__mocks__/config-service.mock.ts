import { ConfigService } from '@nestjs/config';

export type ConfigServiceMock = {
  get: jest.Mock;
};

export function createConfigServiceMock(): ConfigServiceMock {
  return {
    get: jest.fn(),
  };
}

export function asConfigServiceInstance(
  mock: ConfigServiceMock,
): ConfigService {
  return mock as unknown as ConfigService;
}
