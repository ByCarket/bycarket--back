import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';

@Injectable()
export class StripeSimulatorService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async simulateWebhook(eventType: string, data: any) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    const testEndpoint = this.configService.get<string>('TEST_WEBHOOK_ENDPOINT');

    if (!webhookSecret || !testEndpoint) {
      throw new Error('Webhook secret or test endpoint not configured');
    }

    const payload = JSON.stringify({
      type: eventType,
      data: { object: data },
    });

    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signedPayload)
      .digest('hex');

    const stripeSignature = `t=${timestamp},v1=${signature}`;

    try {
      const response = await this.httpService
        .post(testEndpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Stripe-Signature': stripeSignature,
          },
        })
        .toPromise();

      return {
        status: response!.status,
        data: response!.data,
      };
    } catch (error) {
      console.error('Error sending simulated webhook:', error);
      throw error;
    }
  }
}
