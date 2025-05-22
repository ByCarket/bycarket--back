import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}
}
