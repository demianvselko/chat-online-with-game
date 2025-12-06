import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppBootstrapFactory } from '@http/bootstrap/app-bootstrap.factory';
import type { AppConfig } from '@http/config/app.config';

export async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await AppBootstrapFactory.create();

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  if (!appConfig) {
    logger.error('App configuration could not be loaded');
    throw new Error('App configuration could not be loaded');
  }

  await app.listen(appConfig.port, appConfig.host);
  const url = await app.getUrl();

  logger.log(`Backend started at ${url}`);
}

if (require.main === module) {
  bootstrap().catch((error: unknown) => {
    const logger = new Logger('Bootstrap');
    logger.error('Fatal error on bootstrap', error as Error);
    process.exit(1);
  });
}
