import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { PaypackService } from '../paypack/paypack.service';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    private readonly paypackService: PaypackService,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    const gatewayResponse = await this.paypackService.requestPayment(
      dto.amount,
      dto.phoneNumber,
    );

    const transaction = this.transactionRepo.create({
      paymentId: dto.paymentId,
      reference: gatewayResponse.ref,
      kind: gatewayResponse.kind,
      amount: gatewayResponse.amount,
      status: gatewayResponse.status,
      provider: gatewayResponse.provider,
    });

    await this.transactionRepo.save(transaction);

    return transaction;
  }

  async getTransaction(paymentId: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepo.find({
      where: { paymentId, status: TransactionStatus.PENDING },
    });

    for (const transaction of transactions) {
      const gatewayResponse = await this.paypackService.findPayment(
        transaction.reference,
        transaction.status,
      );

      if (!gatewayResponse) return [];

      const latestStatus = gatewayResponse.status;

      if (latestStatus !== TransactionStatus.PENDING) {
        await this.transactionRepo.update(transaction.id, {
          status: latestStatus,
        });
      }
    }

    return await this.transactionRepo.find({
      where: { paymentId },
    });
  }
}
