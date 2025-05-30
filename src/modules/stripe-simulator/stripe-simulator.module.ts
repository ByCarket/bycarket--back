import { Module } from '@nestjs/common';
import { StripeSimulatorService } from './stripe-simulator.service';
import { StripeSimulatorController } from './stripe-simulator.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [StripeSimulatorController],
  providers: [StripeSimulatorService],
})
export class StripeSimulatorModule {}
