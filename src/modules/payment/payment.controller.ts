import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
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

  @Get()
  getPayment() {
    return this.paymentService.getPayment();
  }
}
