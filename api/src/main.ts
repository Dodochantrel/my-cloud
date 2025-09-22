import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger(configService.get<string>('APPLICATION_NAME'));

  // Définition d'un préfixe globale de l'API
  app.setGlobalPrefix('my-cloud-api');
  app.enableCors({
  origin: [
    'http://192.168.1.126',
    'http://192.168.1.126:4200', // si Angular tourne sur ng serve
  ],
  credentials: true,
});

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('My-Cloud API')
    .setDescription('The my-cloud API description')
    .setVersion('1.0')
    .addTag('my-cloud')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const apiPort = configService.get<number>('APP_PORT', 3000);
  logger.log(`Starting listen on port ${apiPort}`);
  await app.listen(apiPort);
}
bootstrap();
