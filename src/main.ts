import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './logging';
import { CustomExceptionFilter } from './filters';
import { TransformInterceptor } from './interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('taxi');

  const loggerService = app.get(LoggerService);
  app.useLogger(loggerService);

  app.useGlobalFilters(new CustomExceptionFilter(loggerService));

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();