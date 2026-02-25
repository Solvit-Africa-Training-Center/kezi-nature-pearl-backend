import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { OrderModule } from '../order/order.module';
import { AddressModule } from '../address/address.module';
import { PaymentModule } from '../payment/payment.module';
import { ItemModule } from '../item/item.module';
import { CurrencyModule } from '../currencies/currencies.module';
import { UserPreferencesModule } from '../user-preferences/user-preferences.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    ItemModule,
    OrderModule,
    AddressModule,
    PaymentModule,
    CurrencyModule,
    UserPreferencesModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
