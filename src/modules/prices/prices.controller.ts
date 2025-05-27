import { Controller, Get, HttpCode } from '@nestjs/common';
import { PricesService } from './prices.service';
import Stripe from 'stripe';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('monthly')
  @HttpCode(200)
  async getSubMonthly(): Promise<Stripe.Price> {
    return await this.pricesService.getSubMonthly();
  }

  @Get('quarterly')
  @HttpCode(200)
  async getSubQuarterly(): Promise<Stripe.Price> {
    return await this.pricesService.getSubQuarterly();
  }

  @Get('annual')
  @HttpCode(200)
  async getSubAnnual(): Promise<Stripe.Price> {
    return await this.pricesService.getSubAnnual();
  }
}
