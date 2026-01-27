import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/modules/category/category.entity';
import { EmailVerificationToken } from 'src/modules/emailVerificationToken/emailVerification.entity';
import { Ingredient } from 'src/modules/ingredient/entities/ingredient.entity';
import { PasswordResetToken } from 'src/modules/passwordResetToken/passwordResetToken.entity';
import { Product } from 'src/modules/product/product.entity';
import { User } from 'src/modules/user/user.entity';

function envDetermine(): string {
  const envi: string = String(process.env.NODE_ENV);

  switch (envi) {
    case 'development':
      return 'DEV';
    case 'test':
      return 'TEST';
    case 'production':
      return 'PROD';
    default:
      return 'DEV';
  }
}

function connectDb(): TypeOrmModuleOptions {
  const envi: string = envDetermine();

  return {
    type: 'postgres',
    url: `postgresql://${process.env[`${envi}_DB_NAME`]}:${process.env[`${envi}_DB_PASSWORD`]}@${process.env[`${envi}_DB_HOST`]}:${Number(process.env[`${envi}_DB_PORT`])}/${process.env[`${envi}_DB_NAME`]}`,
    // host: 'localhost',
    // database: process.env[`${envi}_DB_NAME`],
    // username: process.env[`${envi}_DB_USERNAME`],
    // password: process.env[`${envi}_DB_PASSWORD`],
    // port: Number(process.env[`${envi}_DB_PORT`]),
    // host: process.env[`${envi}_DB_HOST`],
    entities: [
      User,
      Category,
      Product,
      EmailVerificationToken,
      PasswordResetToken,
      Ingredient,
    ],
    synchronize: false,
  };
}

export default registerAs('database', connectDb);
