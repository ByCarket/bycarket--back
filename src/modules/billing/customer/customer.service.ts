import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';

@Injectable()
export class CustomerService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async createCustomer(createCustomerDto): Promise<Stripe.Customer> {
    return await this.stripe.customers.create(createCustomerDto);
  }

  async updateCustomer(id: string, updateCustomerDto): Promise<Stripe.Customer> {
    return await this.stripe.customers.update(id, updateCustomerDto);
  }

  async deleteCustomer(id: string): Promise<Stripe.DeletedCustomer> {
    return await this.stripe.customers.del(id);
  }
}
