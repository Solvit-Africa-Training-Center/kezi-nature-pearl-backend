import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from '../modules/category/category.entity';
import { EmailVerificationToken } from '../modules/emailVerificationToken/emailVerification.entity';
import { Ingredient } from '../modules/ingredient/entities/ingredient.entity';
import { PasswordResetToken } from '../modules/passwordResetToken/passwordResetToken.entity';
import { Product } from '../modules/product/product.entity';
import { User } from '../modules/user/user.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { Contact } from '../modules/contactus/entities/contactus.entity';
import { OrderItem } from 'src/modules/orderitem/entities/orderitem.entity';

export function envDetermine(): string {
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
  const url = process.env[`${envi}_DATABASE_URL`];

  if (!url) {
    throw new Error('DATABASE_URL is not defined');
  }

  const isProd = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    url,
    entities: [
      User,
      Category,
      Product,
      EmailVerificationToken,
      PasswordResetToken,
      Ingredient,
      Order,
      Contact,
      OrderItem,
    ],
    synchronize: false,
    ssl: isProd ? { rejectUnauthorized: false } : false,
  };
}

export default registerAs('database', connectDb);
