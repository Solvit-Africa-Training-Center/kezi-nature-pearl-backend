import {
  Controller,
  Post,
  Head,
  Headers,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaypackService } from './paypack.service';

@Controller('webhooks/paypack') // Keep this
export class PaypackController {
  constructor(private readonly paypackService: PaypackService) {}
  // Handles real webhook POSTs
  @Post()
  @HttpCode(HttpStatus.OK) // Return 200 so Paypack knows we received it
  async handleWebhook(
    @Headers() headers: Record<string, string>,
    @Body() payload: any,
  ) {
    console.log('--- PAYPACK WEBHOOK RECEIVED ---');
    console.log('Headers:', headers);
    console.log('Payload:', payload);

    // Process the webhook safely
    // await this.paypackService.handlePaypackWebhook(payload);

    return { received: true };
  }

  // Handles HEAD request (Paypack often sends this first)
  // @Head()
  // @HttpCode(HttpStatus.OK)
  // headCheck() {
  //   return;
  // }
}
