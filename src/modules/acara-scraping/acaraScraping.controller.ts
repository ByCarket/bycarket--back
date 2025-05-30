import { Controller, Get, Query, HttpCode } from '@nestjs/common';
import { AcaraScrapingService } from './acaraScraping.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('acara-scraping')
export class AcaraScrapingController {
  constructor(private readonly acaraScrapingService: AcaraScrapingService) {}

@Get()
@HttpCode(200)
@ApiQuery({ name: 'authToken', required: false, type: String, description: 'Auth token opcional' })
async scrapeAcara(@Query('authToken') authToken?: string): Promise<any> {
  return this.acaraScrapingService.scrapeData(authToken);
}
}
