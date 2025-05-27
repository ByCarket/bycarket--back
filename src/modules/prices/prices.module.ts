import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { StripeProvider } from 'src/providers/stripe.provider';

@Module({
  controllers: [PricesController],
  providers: [PricesService, StripeProvider],
})
export class PricesModule {}
