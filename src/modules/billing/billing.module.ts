import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';
import { CustomerService } from './customer/customer.service';
import { StripeProvider } from 'src/providers/stripe.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { WebhooksController } from './webhooks/webhooks.controller';
import { WebhooksService } from './webhooks/webhooks.service';
import { Subscription } from 'src/entities/subscription.entity';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesService } from './invoices/invoices.service';
import { Invoice } from 'src/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription, Invoice])],
  controllers: [SubscriptionController, WebhooksController, InvoicesController],
  providers: [
    SubscriptionService,
    CustomerService,
    StripeProvider,
    WebhooksService,
    InvoicesService,
  ],
  exports: [CustomerService],
})
export class BillingModule {}
