import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Order } from '../order/entities/order.entity';
import { PaymentStatus } from 'src/common/enums/product.enum';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const transaction = this.transactionRepo.create({
      order,
      amount: dto.amount,
      status: TransactionStatus.PENDING,
    });

    return this.transactionRepo.save(transaction);
  }

  async getTransactionByReference(reference: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { reference },
      relations: ['order'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async updateTransactionStatus(
    reference: string,
    status: TransactionStatus,
  ): Promise<void> {
    const transaction = await this.transactionRepo.findOne({
      where: { reference },
      relations: ['order'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    transaction.status = status;

   if (status === TransactionStatus.SUCCESS) {
     transaction.order.paymentStatus = PaymentStatus.PAID;
     await this.orderRepo.save(transaction.order);
   }
    await this.transactionRepo.save(transaction);
  }

  async updateTransactionReference(
    transactionId: string,
    reference: string,
  ): Promise<void> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    transaction.reference = reference;
    await this.transactionRepo.save(transaction);
  }
}
