import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from 'src/common/enums/product.enum';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { MomoPaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'momo Payment' })
  async momoPayment(@Body() dto: MomoPaymentDto) {
    return this.paymentService.momoPaymentService(dto);
  }

  // @Patch('status/:transactionId')
  // async updateStatus(
  //   @Param('transactionId') transactionId: string,
  //   @Body('status') status: PaymentStatus,
  // ) {
  //   return this.paymentService.updatePaymentStatus(transactionId, status);
  // }

  // @Get(':transactionId')
  // async getPayment(@Param('transactionId') transactionId: string) {
  //   return this.paymentService.getPaymentByTransaction(transactionId);
  // }
}
