import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from 'src/DTOs/billingDto/customerDto/createCustomer.dto';
import { UpdateCustomerDto } from 'src/DTOs/billingDto/customerDto/updateCustomer.dto';
import { STRIPE_CLIENT } from 'src/providers/stripe.provider';
import Stripe from 'stripe';

@Injectable()
export class CustomerService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}
  async getCustomer(id: string) {
    return await this.stripe.customers.retrieve(id);
  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<string> {
    const customer = await this.stripe.customers.create(createCustomerDto);
    return customer.id;
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<string> {
    await this.stripe.customers.update(id, updateCustomerDto);
    return id;
  }

  async deleteCustomer(id: string): Promise<Stripe.DeletedCustomer> {
    return await this.stripe.customers.del(id);
  }
}
