import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionDto } from 'src/DTOs/billingDto/subscriptionDto/subscription.dto';
import { Subscription } from 'src/entities/subscription.entity';
import { User } from 'src/entities/user.entity';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
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
      customer_email: userDb.email,
      line_items: [{ price, quantity: 1 }],
      mode: 'subscription',
      ui_mode: 'embedded',
      return_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { user_id: userDb.id },
      subscription_data: { metadata: { user_id: userDb.id } },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: { user_id: userDb.id },
          description: `Subscription to Premium Plan for ${userDb.name}`,
          footer: 'Thank you for your business!',
        },
      },
    });

    return {
      session_id: session.id,
      client_secret: session.client_secret,
    };
  }

  async getSubscription(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (!user.subscription_active) {
      throw new NotFoundException('User does not have an active subscription.');
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { id: user.subscription_active, user: { id: userId } },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found for this user.');
    }

    return subscription;
  }

  async getSubscriptionById(userId: string, subscriptionId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        id: subscriptionId,
        user: { id: userId },
      },
    });
    if (!subscription) throw new NotFoundException('Subscription not found for this user.');
    return subscription;
  }

  async createSubscription(user: User, subscription: SubscriptionDto) {
    const newSubscription = await this.subscriptionRepository.create({
      ...subscription,
      user,
    });

    await this.subscriptionRepository.save(newSubscription);
  }

  async updateSubscription(userId: string, { id, ...newSubscription }: SubscriptionDto) {
    const subscription = await this.subscriptionRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found for this user.');

    await this.subscriptionRepository.update(subscription.id, newSubscription);
  }

  async deleteSubscription(userId: string, subscriptionId: string) {
    const subscription = await this.subscriptionRepository.findOneBy({
      id: subscriptionId,
      user: { id: userId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found for this user.');
    await this.subscriptionRepository.delete(subscription.id);
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.getSubscription(userId);

    await this.stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });
  }
}
