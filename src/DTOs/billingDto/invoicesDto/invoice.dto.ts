import { Expose } from 'class-transformer';
import { StatusInvoice } from 'src/enums/statusInvoice.enum';
import { Timestamp } from 'typeorm';

export class InvoiceDto {
  @Expose()
  id: string;

  @Expose()
  hosted_invoice_url: string;

  @Expose()
  invoice_pdf: string;

  @Expose()
  period_end: Timestamp;

  @Expose()
  period_start: Timestamp;

  @Expose()
  status: StatusInvoice | null;

  @Expose()
  total: number;

  @Expose()
  amount_paid: number;
}
