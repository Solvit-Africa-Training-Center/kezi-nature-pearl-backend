import { MiddlewareConsumer, Module, UseFilters } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import serverConfig from './config/server.config';
import databaseConfig from './config/database.config';
import mailConfig from './config/mail.config';
import cloudinaryConfig from './config/cloudinary.config';
import swaggerConfig from './config/swagger.config';

import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/AllExceptionFilter';

import { LoggerService } from './common/logger/logger.service';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { UserModule } from './modules/user/user.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { NotificationModule } from './modules/notification/notification.module';
import { InventoryLogModule } from './modules/inventory-log/inventory-log.module';
import { OrderCouponModule } from './modules/order-coupon/order-coupon.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { ReviewModule } from './modules/review/review.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderModule } from './modules/order/order.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { CartModule } from './modules/cart/cart.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { ProductModule } from './modules/product/product.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { AddressModule } from './modules/address/address.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
import { FileModule } from './modules/file/file.module';

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
    // AuthModule,
    FileModule,
    AddressModule,
    UserPreferencesModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    ProductVariantModule,
    ProductImageModule,
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
    LoggerService,
    // {
    //   provide: APP_FILTER,

    //   useClass: AllExceptionsFilter,
    // },
  ],
  controllers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
