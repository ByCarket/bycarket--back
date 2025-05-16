import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/entities/brand.entity';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Brand]),AuthModule],
    providers: [BrandsService],
    controllers: [BrandsController],
})
export class BrandsModule {}
