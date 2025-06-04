import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('me')
  @HttpCode(200)
  async getInvoice(@UserAuthenticated('sub') userId: string) {
    return await this.invoicesService.getInvoices(userId);
  }
}
