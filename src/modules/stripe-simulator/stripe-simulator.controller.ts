import { Body, Controller, Post } from '@nestjs/common';
import { StripeSimulatorService } from './stripe-simulator.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('stripe-simulator')
export class StripeSimulatorController {
  constructor(private stripeSimulatorService: StripeSimulatorService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        eventType: {
          type: 'string',
          example: 'customer.subscription.updated',
          description: 'The type of Stripe event to simulate',
        },
        data: {
          type: 'object',
          example: {
            id: 'sub_1234',
            status: 'active',
            customer: 'cus_5678',
            plan: {
              id: 'plan_9012',
              nickname: 'Monthly Plan',
            },
          },
          description: 'The data object for the simulated event',
        },
      },
      required: ['eventType', 'data'],
    },
  })
  @Post('simulate-webhook')
  async simulateWebhook(@Body('eventType') eventType: string, @Body('data') data: any) {
    return this.stripeSimulatorService.simulateWebhook(eventType, data);
  }
}
