import { User } from 'src/entities/user.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { InvoiceDto } from './invoice.dto';

export class HandleInvoicesDto {
  user: User;
  subscription: Subscription;
  invoiceDto: InvoiceDto;
}
