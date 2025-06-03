import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Request } from 'express';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('stripe')
  @HttpCode(200)
  async handleSubscription(@Req() req: Request) {
    this.webhooksService.handleSub(req);
    return { received: true };
  }
}
