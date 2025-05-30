import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';
import { CustomerService } from './customer/customer.service';
import { StripeProvider } from 'src/providers/stripe.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { WebhooksController } from './webhooks/webhooks.controller';
import { WebhooksService } from './webhooks/webhooks.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SubscriptionController, WebhooksController],
  providers: [SubscriptionService, CustomerService, StripeProvider, WebhooksService],
  exports: [CustomerService],
})
export class BillingModule {}
