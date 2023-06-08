import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: `http://${process.env.DOMAIN}`,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  try {
    await app.listen(3000);
  } catch (error) {}
}
bootstrap();

//origin: [`http://${process.env.DOMAIN}`, `http://${process.env.DOMAIN}:3000`]
