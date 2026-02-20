import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction.dto';
import { UpdateTransactionReferenceDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionService.createTransaction(dto);
  }

  @Get('reference/:reference')
  getByReference(@Param('reference') reference: string) {
    return this.transactionService.getTransactionByReference(reference);
  }

  @Patch('status/:reference')
  async updateStatus(
    @Param('reference') reference: string,
    @Body() dto: UpdateTransactionStatusDto,
  ) {
    await this.transactionService.updateTransactionStatus(
      reference,
      dto.status,
    );
    return { message: 'Transaction status updated' };
  }

  @Patch('reference-update/:transactionId')
  async updateReference(
    @Param('transactionId') transactionId: string,
    @Body() dto: UpdateTransactionReferenceDto,
  ) {
    await this.transactionService.updateTransactionReference(
      transactionId,
      dto.reference,
    );
    return { message: 'Transaction reference updated' };
  }
}
