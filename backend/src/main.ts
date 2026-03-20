import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: ['https://ai-multi-model-eta.vercel.app'],  // مؤقتًا يخلي أي frontend يشتغل
    credentials: true,
  });

  await app.listen(process.env.PORT || 9999);
}

bootstrap();
