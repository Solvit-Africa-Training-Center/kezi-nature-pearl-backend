import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port: number = Number(configService.get<number>('server.port'));
  const prefix: string = String(configService.get<string>('server.prefix'));
  const host: string = String(configService.get<string>('server.host'));

  app.enableCors({
    origin: true,
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
    console.log(`Server running on port ${port}`);
    console.log(`Swagger docs at ${host}/${prefix}/docs`);
  });
}
bootstrap();
