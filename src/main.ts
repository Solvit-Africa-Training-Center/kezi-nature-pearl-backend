import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { scheduleExchangeRateSync, scheduleTransactionSync } from './cron';
import { LoggerService } from './common/logger/logger.service';
import { OrderService } from './modules/order/order.service';
import { SeederService } from './database/seeders/seeder.service';
import { CurrencyService } from './modules/currencies/currencies.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableImplicitConversion: true,
    }),
  );

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  const seeder = app.get(SeederService);
  await seeder.seedAll();

  const port: number = Number(configService.get<number>('server.port'));
  const prefix: string = String(configService.get<string>('server.prefix'));
  const host: string = String(configService.get<string>('server.host'));

  const orderService = app.get(OrderService);
  scheduleTransactionSync(orderService, logger);

  const currencyService = app.get(CurrencyService);
  scheduleExchangeRateSync(configService, currencyService, logger);

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  app.setGlobalPrefix(prefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kezi Natural Pearl')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  // if (process.env.NODE_ENV !== 'production') {
  SwaggerModule.setup(`/${prefix}/docs`, app, documentFactory);
  // }

  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
    logger.log(`Swagger docs at ${host}/${prefix}/docs`);
  });
}
bootstrap();
