import { Body, Controller, Post } from '@nestjs/common';
import { PaypackService } from './paypack.service';
import { CreatePaypackDto } from './dto/create-paypack.dto';

@Controller('webhooks/paypack')
export class PaypackController {
  constructor(private readonly paypackService: PaypackService) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    await this.paypackService.handlePaypackWebhook(payload);
    return { message: 'Webhook received' };
  }

  @Post('momo-payment')
  async momoPayment(@Body() dto: CreatePaypackDto) {
    await this.paypackService.create(dto);
    return { message: 'Payment in progress' };
  }
}
