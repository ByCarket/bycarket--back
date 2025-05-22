import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';
import { CustomerService } from './customer/customer.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, CustomerService]
})
export class BillingModule {}
