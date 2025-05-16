import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/entities/brand.entity';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Brand])],
    providers: [BrandsService],
    controllers: [BrandsController],
})
export class BrandsModule {}
