import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepo.create({
      user: { id: dto.userId } as User,
      amount: dto.amount,
      orderId: dto.orderId,
      status: TransactionStatus.PENDING,
    });

    return this.transactionRepo.save(transaction);
  }

  async getTransactionByReference(reference: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { reference },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return transaction;
  }

  async updateTransactionReference(
    transactionId: string,
    reference: string,
  ): Promise<void> {
    const result = await this.transactionRepo.update(transactionId, {
      reference,
    });

    if (result.affected === 0)
      throw new NotFoundException('Transaction not found');
  }

  async updateTransactionStatus(
    reference: string,
    status: TransactionStatus,
  ): Promise<void> {
    const transaction = await this.transactionRepo.findOne({
      where: { reference },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    if (transaction.status !== TransactionStatus.PENDING)
      throw new BadRequestException('Transaction already processed');

    transaction.status = status;
    await this.transactionRepo.save(transaction);
  }
}
