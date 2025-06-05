import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleSubDto } from 'src/DTOs/billingDto/webhooksDto/handleSub.dto';
import { User } from 'src/entities/user.entity';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { SubscriptionService } from '../subscription/subscription.service';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/enums/roles.enum';
import { InvoiceDto } from 'src/DTOs/billingDto/invoicesDto/invoice.dto';
import { InvoicesService } from '../invoices/invoices.service';
import { Subscription } from 'src/entities/subscription.entity';
import { HandleInvoicesDto } from 'src/DTOs/billingDto/invoicesDto/handleInvoices.dto';
import { HandleSubscriptionDto } from 'src/DTOs/billingDto/subscriptionDto/handleSubscription.dto';
import { SubscriptionDto } from 'src/DTOs/billingDto/subscriptionDto/subscription.dto';
import { MailService } from 'src/modules/mail-notification/mailNotificacion.service';
import { Request } from 'express';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly subscriptionService: SubscriptionService,
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) {}

  async handleSub(req: Request) {
    const event: Stripe.Event = req.body;

    switch (event.type) {
      case 'customer.created':
        const customerCreated = event.data.object as Stripe.Customer;
        await this.handleCustomerCreated(customerCreated);
        break;
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

  // Handle Customers
  // These methods are called when the customer events are triggered by Stripe.

  private async handleCustomerCreated(customer: Stripe.Customer) {
    if (!customer.email) {
      throw new BadRequestException('Customer email is required');
    }
    const user = await this.usersRepository.findOneBy({ email: customer.email });
    if (!user) {
      throw new NotFoundException('User not found for customer creation');
    }

    user.stripeCustomerId = customer.id;
    await this.usersRepository.save(user);
  }

  // Handle Subscriptions
  // These methods are called when the subscription events are triggered by Stripe.

  private async handleSubCreated(subscription: Stripe.Subscription) {
    console.log('Subscription created:', subscription);
    const { user, subscriptionDto } = await this.handleSubscriptionsValidations(subscription);

    console.log('User found:', user);
    console.log('Subscription DTO:', subscriptionDto);
    await this.subscriptionService.createSubscription(user, subscriptionDto);

    user.role = Role.PREMIUM;
    user.subscription_active = subscriptionDto.id;
    const userDb = await this.usersRepository.save(user);

    console.log('User updated:', userDb);
  }

  private async handleSubTrialEnd(subscription: Stripe.Subscription) {}

  private async handleSubPaused(subscription: Stripe.Subscription) {}

  private async handleSubUpdated(subscription: Stripe.Subscription) {
    const { user, subscriptionDto } = await this.handleSubscriptionsValidations(subscription);

    await this.subscriptionService.updateSubscription(user.id, subscriptionDto);
  }

  private async handleSubDeleted(subscription: Stripe.Subscription) {
    const { user } = await this.handleSubscriptionsValidations(subscription);

    user.role = Role.USER;
    user.subscription_active = null;
    await this.usersRepository.save(user);
  }

  private async handleSubResumed(subscription: Stripe.Subscription) {}

  private async handleSubscriptionsValidations(
    subscription: Stripe.Subscription,
  ): Promise<HandleSubscriptionDto> {
    const customer = await this.stripe.customers.retrieve(subscription.customer as string);
    if (!customer || customer.deleted) {
      throw new BadRequestException(`Customer ${subscription.customer} not found or deleted`);
    }

    const stripeCustomer = customer as Stripe.Customer;
    if (!stripeCustomer.email) {
      throw new BadRequestException('Customer email is required for subscription validation');
    }

    const user = await this.usersRepository.findOne({
      where: [
        { email: stripeCustomer.email },
        { stripeCustomerId: subscription.customer as string },
      ],
    });

    if (!user) {
      throw new NotFoundException(
        `User not found for customer ${subscription.customer} with email ${stripeCustomer.email}`,
      );
    }

    const subscriptionDto = plainToInstance(SubscriptionDto, subscription, {
      excludeExtraneousValues: true,
    });

    return {
      user,
      subscriptionDto,
    };
  }

  // Handle Invoices
  // These methods are called when the invoice events are triggered by Stripe.

  private async handleInvoiceCreated(invoice: Stripe.Invoice) {
    const result = await this.handleInvoicesValidations(invoice);
    await this.invoicesService.createInvoice(result);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    try {
    console.log('Processing paid invoice:', invoice.id);
    
    const result = await this.handleInvoicesValidations(invoice);
    const user = result.user;
    
    // Actualizar la factura en la base de datos si es necesario
    await this.invoicesService.updateInvoice(result);
    
    // Preparar información del pago para el email
    const paymentInfo = {
      amount: invoice.amount_paid || 0,
      currency: invoice.currency || 'usd',
      invoiceId: invoice.id,
      subscriptionPeriodStart: new Date((invoice.period_start || 0) * 1000),
      subscriptionPeriodEnd: new Date((invoice.period_end || 0) * 1000),
    };

    // Enviar notificación por email
    await this.mailService.sendSubscriptionPaymentSuccessEmail(
      user.email,
      user.name || user.email.split('@')[0], // Usar el nombre del usuario o parte del email
      paymentInfo
    );

    console.log(`Payment notification sent successfully for invoice ${invoice.id} to user ${user.email}`);

  } catch (error) {
    console.error('Error processing paid invoice:', error);
    // No lanzar el error para que no afecte el procesamiento del webhook
    console.warn('Invoice payment processing failed, but payment was successful in Stripe');
  }
  }

  private async handleInvoiceUpdated(invoice: Stripe.Invoice) {
    const result = await this.handleInvoicesValidations(invoice);
    await this.invoicesService.updateInvoice(result);
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {}

  private async handleInvoicesValidations(invoice: Stripe.Invoice): Promise<HandleInvoicesDto> {
    const customer = await this.stripe.customers.retrieve(invoice.customer as string);
    if (!customer || customer.deleted) {
      throw new BadRequestException(`Customer ${invoice.customer} not found or deleted`);
    }

    const stripeCustomer = customer as Stripe.Customer;
    if (!stripeCustomer.email) {
      throw new BadRequestException('Customer email is required for subscription validation');
    }

    const user = await this.usersRepository.findOne({
      where: [{ email: stripeCustomer.email }, { stripeCustomerId: invoice.customer as string }],
    });
    if (!user) {
      throw new NotFoundException(
        `User not found for customer ${invoice.customer} with email ${stripeCustomer.email}`,
      );
    }
    const invoiceDto = plainToInstance(InvoiceDto, invoice, {
      excludeExtraneousValues: true,
    });

    return {
      user,
      invoiceDto,
    };
  }
}
