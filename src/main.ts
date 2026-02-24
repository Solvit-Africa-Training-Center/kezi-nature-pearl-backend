import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { scheduleTransactionSync } from './cron';
import { PaymentService } from './modules/payment/payment.service';
import { LoggerService } from './common/logger/logger.service';
import { OrderService } from './modules/order/order.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  const port: number = Number(configService.get<number>('server.port'));
  const prefix: string = String(configService.get<string>('server.prefix'));
  const host: string = String(configService.get<string>('server.host'));

  const orderService = app.get(OrderService);
  scheduleTransactionSync(orderService, logger);

  app.enableCors({
    origin: true,
    credentials: true,
    // exposedHeaders: ['set-cookie'],
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
