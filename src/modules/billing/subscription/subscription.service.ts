import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto } from 'src/DTOs/billingDto/subscriptionDto/createSession.dto';
import { User } from 'src/entities/user.entity';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {}

  async getSessionById(id: string): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.retrieve(id);
    if (!session) throw new NotFoundException('Session not found.');

    return session;
  }

  async createSession(userId: string, price: string) {
    const userDb = await this.userRepository.findOneBy({ id: userId });
    const success_url = this.configService.get<string>('STRIPE_SUCCESS_URL');
    if (!userDb) throw new NotFoundException('User not found.');
    if (!success_url) {
      throw new InternalServerErrorException('Stripe success url is not defined in configuration');
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: userDb.stripeCustomerId,
      line_items: [{ price, quantity: 1 }],
      mode: 'subscription',
      ui_mode: 'custom',
      return_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { user_id: userDb.id },
      subscription_data: { metadata: { user_id: userDb.id } },
    });

    return {
      session_id: session.id,
      client_secret: session.client_secret,
    };
  }
}
