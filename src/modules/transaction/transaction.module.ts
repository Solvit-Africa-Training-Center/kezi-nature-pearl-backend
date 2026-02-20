import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { Transaction } from './entities/transaction.entity';
import { PaypackModule } from '../paypack/paypack.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Order]), PaypackModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
