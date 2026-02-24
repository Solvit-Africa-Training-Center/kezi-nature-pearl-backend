import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import serverConfig from './config/server.config';
import databaseConfig from './config/database.config';
import mailConfig from './config/mail.config';
import cloudinaryConfig from './config/cloudinary.config';
import swaggerConfig from './config/swagger.config';
import paypackConfig from './config/paypack.config';

import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/AllExceptionFilter';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from './shared/redis/redis.module';

import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { FileModule } from './modules/file/file.module';
import { AddressModule } from './modules/address/address.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { CartModule } from './modules/cart/cart.module';
import { ItemModule } from './modules/item/item.module';
import { OrderModule } from './modules/order/order.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ReviewModule } from './modules/review/review.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { OrderCouponModule } from './modules/order-coupon/order-coupon.module';
import { InventoryLogModule } from './modules/inventory-log/inventory-log.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

import { LoggerModule } from './common/logger/logger.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { PaypackModule } from './modules/paypack/paypack.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CurrencyModule } from './modules/currencies/currencies.module';
import { SeederService } from './database/seeders/seeder.service';
import { SeederModule } from './database/seeders/seeder.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        serverConfig,
        mailConfig,
        cloudinaryConfig,
        swaggerConfig,
        paypackConfig,
      ],
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),

    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
      global: true,
    }),

    RedisModule,
    LoggerModule,

    FileModule,
    PaypackModule,

    // Endpoints

    AuthModule, // ( Done )
    UserModule, // ( Done )
    CategoryModule, // ( Done )
    AddressModule, // ( Done )
    ProductModule, // ( Done )
    ProductImageModule, // ( Done )

    ItemModule, // ( Done )
    CartModule, // ( Done )

    OrderModule, // ( Done )

    PaymentModule,
    TransactionModule,
    WishlistModule,
    ReviewModule,

    ContactUsModule,

    CurrencyModule,

    UserPreferencesModule,
    // CouponModule,
    // OrderCouponModule,
    // InventoryLogModule,
    // NotificationModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  // }
}
