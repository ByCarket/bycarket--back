import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';
import { CustomerService } from './customer/customer.service';
import { StripeProvider } from 'src/providers/stripe.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, CustomerService, StripeProvider],
  exports: [CustomerService],
})
export class BillingModule {}
