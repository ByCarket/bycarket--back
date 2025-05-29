import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleSubDto } from 'src/DTOs/billingDto/webhooksDto/handleSub.dto';
import { User } from 'src/entities/user.entity';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) {}

  async handleSub(handleSub: HandleSubDto) {
    const event: Stripe.Event = await this.verifySignature(handleSub);

    switch (event.type) {
      case 'customer.subscription.created':
        // Actualizar rol y bd
        const subscriptionCreated = event.data.object;
        await this.handleSubCreated(subscriptionCreated);
        break;
      case 'customer.subscription.trial_will_end':
        // Enviar un email de que la prueba se va a acabar.
        const subscriptionTrialEnd = event.data.object;
        await this.handleSubTrialEnd(subscriptionTrialEnd);
        break;
      case 'customer.subscription.paused':
        // Enviar un email para que retome la subscripcion.
        const subscriptionPaused = event.data.object;
        await this.handleSubPaused(subscriptionPaused);
        break;
      case 'customer.subscription.updated':
        // Actualizar bd.
        const subscriptionUpdated = event.data.object;
        await this.handleSubUpdated(subscriptionUpdated);
        break;
      case 'customer.subscription.deleted':
        // Asignarle el rol de usuario nuevamente
        const subscriptionDeleted = event.data.object;
        await this.handleSubDeleted(subscriptionDeleted);
        break;
      case 'customer.subscription.resumed':
        // Cuando esta pausada y pasa a estar activa de nuevo
        const subscriptionResumed = event.data.object;
        await this.handleSubResumed(subscriptionResumed);
        break;
      case 'invoice.created':
        // Guardar factura en bd.
        const invoiceCreated = event.data.object;
        await this.handleInvoiceCreated(invoiceCreated);
        break;
      case 'invoice.paid':
        //
        const invoice = event.data.object;
        await this.handleInvoicePaid(invoice);
        break;
      case 'invoice.updated':
        // Actualizar factura en bd.
        const invoiceUpdated = event.data.object;
        await this.handleInvoiceUpdated(invoiceUpdated);
        break;
      case 'invoice.payment_failed':
        //
        const invoicePaymentFailed = event.data.object;
        await this.handleInvoicePaymentFailed(invoicePaymentFailed);
        break;
    }
  }

  async verifySignature({ raw, signature }: HandleSubDto) {
    const secret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!secret) {
      console.error(
        'Faltó el secreto de webhook. Posible error de configuración de variables de entorno',
      );
      throw new InternalServerErrorException('Internal server error: webhook secret missing');
    }

    return await this.stripe.webhooks.constructEventAsync(raw, signature, secret);
  }

  private async handleSubCreated(sub: Stripe.Subscription) {}

  private async handleSubTrialEnd(sub: Stripe.Subscription) {}

  private async handleSubPaused(sub: Stripe.Subscription) {}

  private async handleSubUpdated(sub: Stripe.Subscription) {}

  private async handleSubDeleted(sub: Stripe.Subscription) {}

  private async handleSubResumed(sub: Stripe.Subscription) {}

  private async handleInvoiceCreated(invoice: Stripe.Invoice) {}

  private async handleInvoicePaid(invoice: Stripe.Invoice) {}

  private async handleInvoiceUpdated(invoice: Stripe.Invoice) {}

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {}
}
