import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AcaraScrapingController } from './acaraScraping.controller';
import { AcaraScrapingService } from './acaraScraping.service';

@Module({
  imports: [HttpModule],
  controllers: [AcaraScrapingController],
  providers: [AcaraScrapingService],
  exports: [AcaraScrapingService],
})
export class AcaraScrapingModule {}
