import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleInvoicesDto } from 'src/DTOs/billingDto/invoicesDto/handleInvoices.dto';
import { Invoice } from 'src/entities/invoice.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private readonly invoicesRepository: Repository<Invoice>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createInvoice({ user, invoiceDto }: HandleInvoicesDto) {
    const invoice = await this.invoicesRepository.create({
      ...invoiceDto,
      user,
    });
    await this.invoicesRepository.save(invoice);
  }

  async updateInvoice({ user, invoiceDto }: HandleInvoicesDto) {
    const invoiceDb = await this.invoicesRepository.findOne({
      where: {
        id: invoiceDto.id,
        user: { id: user.id },
      },
    });
    if (!invoiceDb) {
      throw new NotFoundException(
        'Invoice not found or does not belong to the user or subscription',
      );
    }

    await this.invoicesRepository.update(invoiceDb.id, invoiceDto);
  }

  async getInvoices(userId: string): Promise<Invoice[]> {
    const invoices = await this.invoicesRepository.find({
      where: { user: { id: userId } },
      order: { period_end: 'DESC' },
    });

    return invoices;
  }
}
