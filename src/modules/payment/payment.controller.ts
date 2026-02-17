import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from 'src/common/enums/product.enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'momo Payment' })
  async momoPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.momoPaymentService(dto);
  }

  @Patch('status/:transactionId')
  async updateStatus(
    @Param('transactionId') transactionId: string,
    @Body('status') status: PaymentStatus,
  ) {
    return this.paymentService.updatePaymentStatus(transactionId, status);
  }

  @Get(':transactionId')
  async getPayment(@Param('transactionId') transactionId: string) {
    return this.paymentService.getPaymentByTransaction(transactionId);
  }
}
