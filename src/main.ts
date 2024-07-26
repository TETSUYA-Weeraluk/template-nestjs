import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Test Swagger')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Hello Worlds')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(env.PART_SWAGGER || 'api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(env.PORT || 3000, () => {
    console.log(`Application is running on: ${env.PORT || 3000}`);
  });
}
bootstrap();
