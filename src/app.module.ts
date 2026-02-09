import { MiddlewareConsumer, Module, UseFilters } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import serverConfig from './config/server.config';
import databaseConfig from './config/database.config';
import mailConfig from './config/mail.config';
import cloudinaryConfig from './config/cloudinary.config';
import swaggerConfig from './config/swagger.config';
import redisConfig from './config/redis.config';

import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/AllExceptionFilter';

import { LoggerService } from './common/logger/logger.service';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { FileModule } from './modules/file/file.module';
import { AddressModule } from './modules/address/address.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { PaymentModule } from './modules/payment/payment.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ReviewModule } from './modules/review/review.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { OrderCouponModule } from './modules/order-coupon/order-coupon.module';
import { InventoryLogModule } from './modules/inventory-log/inventory-log.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './shared/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, mailConfig, cloudinaryConfig, swaggerConfig],
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),

    RedisModule,

    AuthModule,
    UserModule,
    FileModule,
    CategoryModule,
    ProductModule,
    ProductImageModule,
    AddressModule,
    UserPreferencesModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
    WishlistModule,
    ReviewModule,
    CouponModule,
    OrderCouponModule,
    InventoryLogModule,
    NotificationModule,
    ContactUsModule,
  ],
  providers: [
    // LoggerService,
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
  ],
  controllers: [],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  // }
}
