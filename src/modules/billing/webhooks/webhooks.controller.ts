import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('stripe')
  @HttpCode(200)
  async handleSubscription(@Req() req: Request) {
    await this.webhooksService.handleSub(req);
    return { received: true };
  }
}
