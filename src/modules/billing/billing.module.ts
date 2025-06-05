import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';
import { StripeProvider } from 'src/providers/stripe.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { WebhooksController } from './webhooks/webhooks.controller';
import { WebhooksService } from './webhooks/webhooks.service';
import { Subscription } from 'src/entities/subscription.entity';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesService } from './invoices/invoices.service';
import { Invoice } from 'src/entities/invoice.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription, Invoice]), forwardRef(() => UsersModule)],
  controllers: [SubscriptionController, WebhooksController, InvoicesController],
  providers: [SubscriptionService, StripeProvider, WebhooksService, InvoicesService],
})
export class BillingModule {}
