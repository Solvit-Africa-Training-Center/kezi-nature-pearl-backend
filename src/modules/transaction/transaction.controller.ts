import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(dto);
  }

  @Post('reference/:reference')
  async getByReference(@Param('reference') reference: string) {
    return this.transactionsService.getTransactionByReference(reference);
  }

  @Patch('status/:reference')
  async updateStatus(
    @Param('reference') reference: string,
    @Body('status') status: TransactionStatus,
  ) {
    await this.transactionsService.updateTransactionStatus(reference, status);
    return { message: 'Transaction status updated' };
  }

  @Patch('reference-update/:transactionId')
  async updateReference(
    @Param('transactionId') transactionId: string,
    @Body('reference') reference: string,
  ) {
    await this.transactionsService.updateTransactionReference(
      transactionId,
      reference,
    );
    return { message: 'Transaction reference updated' };
  }
}
