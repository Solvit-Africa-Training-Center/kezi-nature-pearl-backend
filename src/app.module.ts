import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import serverConfig from './config/server.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import databaseConfig from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryService } from './modules/category/category.service';
import { CategoryController } from './modules/category/category.controller';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import mailConfig from './config/mail.config';
import { EmailVerificationTokenModule } from './modules/emailVerificationToken/emailVerificationToken.module';
import { PasswordResetTokenModule } from './modules/passwordResetToken/passwordResetToken.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, mailConfig],
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    EmailVerificationTokenModule,
    PasswordResetTokenModule,
    IngredientModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
