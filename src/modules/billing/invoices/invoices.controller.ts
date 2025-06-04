import { Controller, Get, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('me')
  async getInvoice(@UserAuthenticated('sub') userId: string) {
    return await this.invoicesService.getInvoices(userId);
  }
}
