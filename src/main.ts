import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transforms payloads to the appropriate DTO types
      whitelist: true, // Strips any properties not defined in DTO
    }),
  );

  const configService = app.get(ConfigService);
  const port: number = Number(configService.get<number>('server.port'));
  const prefix: string = String(configService.get<string>('server.prefix'));
  // const origin: string = String(configService.get<string>('server.origin'));

  // if (!origin) {
  //   throw new Error('SERVER_ORIGIN is not defined');
  // }

  // app.enableCors({
  //   origin: (requestOrigin, callback) => {
  //     if (!requestOrigin) {
  //       return callback(null, true);
  //     }

  //     if (origin.includes(requestOrigin)) {
  //       return callback(null, true);
  //     }

  //     callback(new Error('Not allowed by CORS'));
  //   },
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });

  const config = new DocumentBuilder()
    .setTitle('Kezi Natural Pearl')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // if (process.env.NODE_ENV !== 'production') {
  SwaggerModule.setup(`/${prefix}/docs`, app, documentFactory);
  // }

  app.setGlobalPrefix(prefix);

  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
bootstrap();
