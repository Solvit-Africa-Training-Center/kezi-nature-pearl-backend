import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Order } from '../order/entities/order.entity';
import { PaymentStatus } from 'src/common/enums/product.enum';
import { PaypackService } from '../paypack/paypack.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    private readonly paypackService: PaypackService,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const transaction = this.transactionRepo.create({
      order,
      amount: order.finalAmount,
      status: TransactionStatus.PENDING,
    });

    const gatewayResponse = await this.paypackService.requestPayment(
      order.finalAmount,
      dto.phoneNumber,
    );

    transaction.reference = gatewayResponse.ref;

    await this.transactionRepo.save(transaction);

    return { transaction, gatewayResponse };
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
