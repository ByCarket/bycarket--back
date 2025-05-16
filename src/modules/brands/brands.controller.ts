import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from '../../dto/create-brand.dto';
import { UpdateBrandDto } from '../../dto/update-brand.dto';
import { Brand } from 'src/entities/brand.entity';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
    constructor(private readonly service: BrandsService) {}

    @Get()
    findAll(): Promise<Brand[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Brand> {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateBrandDto): Promise<Brand> {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBrandDto): Promise<Brand> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.service.delete(id);
    }
}
