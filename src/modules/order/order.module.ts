import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { PaymentModule } from '../payment/payment.module';
import { ItemModule } from '../item/item.module';
import { ProductModule } from '../product/product.module';
import { CurrencyModule } from '../currencies/currencies.module';
import { UserPreferencesModule } from '../user-preferences/user-preferences.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    PaymentModule,
    ItemModule,
    ProductModule,
    CurrencyModule,
    UserPreferencesModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
