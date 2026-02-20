import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItemModule } from '../cart-item/cart-item.module';
import { ProductModule } from '../product/product.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { OrderModule } from '../order/order.module';
import { AddressModule } from '../address/address.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    OrderModule,
    AddressModule,
    PaymentModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
