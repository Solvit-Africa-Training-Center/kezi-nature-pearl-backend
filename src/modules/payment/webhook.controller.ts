import { Controller, Post, Body } from "@nestjs/common";
import { PaypackService } from "./webhook.service";

@Controller('webhooks/paypack')
export class PaypackWebhookController {
  constructor(private readonly paypackService: PaypackService) {}

  @Post()
  async handlePaypackWebhook(@Body() payload: any) {
    return this.paypackService.handlePaypackWebhook(payload);
  }
}
