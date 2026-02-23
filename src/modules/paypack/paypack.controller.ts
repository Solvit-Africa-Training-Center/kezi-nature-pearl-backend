import { Controller, Post, Headers, Body } from '@nestjs/common';
import { PaypackService } from './paypack.service';

@Controller('webhooks/paypack') // Keep this
export class PaypackController {
  constructor(private readonly paypackService: PaypackService) {}
  @Post()
  async handleWebhook(
    @Headers() headers: Record<string, string>,
    @Body() payload: any,
  ) {
    console.log('--- PAYPACK WEBHOOK RECEIVED ---');
    console.log('Headers:', headers);
    console.log('Payload:', payload);

    return { received: true };
  }
}
