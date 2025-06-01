import { User } from 'src/entities/user.entity';
import { CreateInvoiceDto } from './invoice.dto';
import { Subscription } from 'src/entities/subscription.entity';

export class HandleInvoicesDto {
  user: User;
  subscription: Subscription;
  invoiceDto: CreateInvoiceDto;
}
