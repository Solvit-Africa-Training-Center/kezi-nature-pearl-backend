import { MiddlewareConsumer, Module, UseFilters } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import serverConfig from './config/server.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import databaseConfig from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import mailConfig from './config/mail.config';
import { EmailVerificationTokenModule } from './modules/emailVerificationToken/emailVerificationToken.module';
import { PasswordResetTokenModule } from './modules/passwordResetToken/passwordResetToken.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/AllExceptionFilter';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './modules/orders/orders.module';
import { ContactusModule } from './modules/contactus/contactus.module';
import { LoggerService } from './common/logger/logger.service';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { FileModule } from './modules/file/file.module';
import cloudinaryConfig from './config/cloudinary.config';
import swaggerConfig from './config/swagger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, mailConfig, cloudinaryConfig, swaggerConfig],
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    JwtModule.register({
      global: true,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    EmailVerificationTokenModule,
    PasswordResetTokenModule,
    IngredientModule,
    OrdersModule,
    ContactusModule,
    FileModule,
  ],
  providers: [
    LoggerService,
    {
      provide: APP_FILTER,

      useClass: AllExceptionsFilter,
    },
  ],
  controllers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
