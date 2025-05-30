import { Controller, Headers, HttpCode, Post, RawBody } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('stripe')
  @HttpCode(200)
  async handleSubscription(@RawBody() raw: Buffer, @Headers('stripe-signature') signature: string) {
    this.webhooksService.handleSub({ raw, signature });
    return { received: true };
  }
}
