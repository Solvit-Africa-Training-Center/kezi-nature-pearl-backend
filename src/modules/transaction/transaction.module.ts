import { Module } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { Transaction } from './entities/transaction.entity';
import { PaypackModule } from '../paypack/paypack.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Order]),
    PaypackModule, 
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionModule {}
