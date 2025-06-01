import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleInvoicesDto } from 'src/DTOs/billingDto/invoicesDto/handleInvoices.dto';
import { Invoice } from 'src/entities/invoice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private readonly invoicesRepository: Repository<Invoice>,
  ) {}

  async createInvoice({ user, subscription, invoiceDto }: HandleInvoicesDto) {
    const invoice = await this.invoicesRepository.create({
      ...invoiceDto,
      user,
      subscription,
    });
    await this.invoicesRepository.save(invoice);
  }

  async updateInvoice({ user, subscription, invoiceDto }: HandleInvoicesDto) {
    const invoiceDb = await this.invoicesRepository.findOne({
      where: {
        id: invoiceDto.id,
        user: { id: user.id },
        subscription: { id: subscription.id },
      },
    });
    if (!invoiceDb) {
      throw new NotFoundException(
        'Invoice not found or does not belong to the user or subscription',
      );
    }

    await this.invoicesRepository.update(invoiceDb.id, invoiceDto);
  }
}
