import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaypackService } from './paypack.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('webhooks/paypack')
export class PaypackController {
  constructor(private readonly paypackService: PaypackService) {}

  @Get()
  @ApiExcludeEndpoint()
  async handleWebhook(@Body() payload: any) {
    await this.paypackService.handlePaypackWebhook(payload);
    return { message: 'Webhook received' };
  }
}
