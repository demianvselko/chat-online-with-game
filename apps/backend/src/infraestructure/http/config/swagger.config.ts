import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import type { AppConfig } from '@http/config/app.config';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  if (appConfig?.nodeEnv === 'production') {
    return;
  }

  const apiName = configService.get<string>('SWAGGER_NAME') ?? 'Backend API';
  const apiDescription =
    configService.get<string>('SWAGGER_DESCRIPTION') ?? 'API documentation';
  const apiVersion =
    configService.get<string>('SWAGGER_VERSION') ??
    process.env.npm_package_version ??
    '1.0.0';

  const config = new DocumentBuilder()
    .setTitle(apiName)
    .setDescription(apiDescription)
    .setVersion(apiVersion)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
