import { User } from 'src/entities/user.entity';
import { InvoiceDto } from './invoice.dto';

export class HandleInvoicesDto {
  user: User;
  invoiceDto: InvoiceDto;
}
