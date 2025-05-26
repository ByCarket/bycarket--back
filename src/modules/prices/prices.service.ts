import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';

@Injectable()
export class PricesService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) {}

  async getSubMonthly(): Promise<Stripe.Price> {
    const id = this.configService.get<string>('PRICE_MONTHLY_ID');
    if (!id)
      throw new InternalServerErrorException(
        'Missing required environment variable: PRICE_MONTHLY_ID',
      );

    return await this.stripe.prices.retrieve(id);
  }

  async getSubQuarterly(): Promise<Stripe.Price> {
    const id = this.configService.get<string>('PRICE_QUARTERLY_ID');
    if (!id)
      throw new InternalServerErrorException(
        'Missing required environment variable: PRICE_QUARTERLY_ID',
      );

    return await this.stripe.prices.retrieve(id);
  }

  async getSubAnnual(): Promise<Stripe.Price> {
    const id = this.configService.get<string>('PRICE_ANNUAL_ID');
    if (!id)
      throw new InternalServerErrorException(
        'Missing required environment variable: PRICE_ANNUAL_ID',
      );

    return await this.stripe.prices.retrieve(id);
  }
}
