import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

import { User } from './modules/user/user.entity';
import { Category } from './modules/category/category.entity';
import { Product } from './modules/product/product.entity';
import { Ingredient } from './modules/ingredient/entities/ingredient.entity';
import { EmailVerificationToken } from './modules/emailVerificationToken/emailVerification.entity';
import { PasswordResetToken } from './modules/passwordResetToken/passwordResetToken.entity';
import { envDetermine } from './config/database.config';
import { Order } from './modules/orders/entities/order.entity';
import { Contact } from './modules/contactus/entities/contactus.entity';
import { OrderItem } from './modules/orderitem/entities/orderitem.entity';

const envi = envDetermine() || 'DEV';

const url = process.env[`${envi}_DATABASE_URL`];

if (!url) {
  throw new Error('DATABASE_URL is not defined');
}

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url,
  ssl: isProd ? { rejectUnauthorized: false } : false,
  entities: [
    User,
    Category,
    Product,
    Ingredient,
    EmailVerificationToken,
    PasswordResetToken,
    Order,
    Contact,
    OrderItem,
  ],
  migrations: ['src/migrations/*.{ts,js}'],
  synchronize: false,
});
