import { Module } from '@nestjs/common';
import { PaypackService } from './paypack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  providers: [PaypackService],
  exports: [PaypackService], 
})
export class PaypackModule {}
