import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/httpException.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  console.log('process.env.MONGOOSE_URL', process.env.MONGOOSE_URL);
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  //useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3333);
}
bootstrap();
