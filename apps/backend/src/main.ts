import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: `${process.env.FRONTEND_URL} || 'http://localhost:3000'`,
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();