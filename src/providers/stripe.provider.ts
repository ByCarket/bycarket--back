import { HttpException, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export const STRIPE_CLIENT = 'STRIPE_CLIENT';

export const StripeProvider: Provider = {
  provide: STRIPE_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Stripe => {
    const secretKey = configService.get<string>('stripe.secretKey');
    if (!secretKey)
      throw new HttpException(
        { statusCode: 500, message: 'Stripe secret key is not defined in configuration' },
        500,
      );
    return new Stripe(secretKey, {
      apiVersion: '2025-04-30.basil',
    });
  },
};
