import { Controller, Get, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';

@Controller('invoices')
export class InvoicesController {
constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':id')
  async getInvoice(@Param('id') id: string, @UserAuthenticated('sub') userId: string) {
      return await this.invoicesService.getInvoice(userId, id )
}
}