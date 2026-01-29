import { Module, UseFilters } from '@nestjs/common';
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
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/HttpExceptionFilter';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, mailConfig],
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
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  controllers: [],
})
export class AppModule {}
