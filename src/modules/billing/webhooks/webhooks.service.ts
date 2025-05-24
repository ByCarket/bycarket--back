import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) {}

  async handleSub(req: Request) {
    const event: Stripe.Event = await this.verifySignature(req);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Acciones leves, por ejemplo enviar email de bienvenida.
        break;
      case 'customer.subscription.created':
        const subscription = event.data.object;

        break;
      case 'customer.subscription.trial_will_end':
        const trial_end = event.data.object;

        break;
      case 'invoice.paid':
        const invoice = event.data.object;

        break;
      case 'invoice.payment_failed':
        const invoice_failed = event.data.object;
    }
  }

  async verifySignature(req: Request) {
    const rawBody = req.rawBody;
    const signature = req.headers['stripe-signature'];
    const secret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!signature) throw new BadRequestException('Bad request: signature missing');
    if (!rawBody) {
      console.error('Faltó rawBody. Posible error de configuración del middleware');
      throw new InternalServerErrorException('Internal server error: raw body missing');
    }
    if (!secret) {
      console.error(
        'Faltó el secreto de webhook. Posible error de configuración de variables de entorno',
      );
      throw new InternalServerErrorException('Internal server error: webhook secret missing');
    }

    return await this.stripe.webhooks.constructEventAsync(rawBody, signature, secret);
  }
}
