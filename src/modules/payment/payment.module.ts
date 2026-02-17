import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionsService } from '../transaction/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order]),
    TransactionModule, 
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  
})
export class PaymentModule {}
