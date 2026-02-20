import { Body, Controller, Post } from '@nestjs/common';
import { PaypackService } from './paypack.service';

@Controller('webhooks/paypack')
export class PaypackController {
  constructor(private readonly paypackService: PaypackService) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    await this.paypackService.handlePaypackWebhook(payload);
    return { message: 'Webhook received' };
  }
}
