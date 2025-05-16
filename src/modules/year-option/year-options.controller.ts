import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { YearOptionsService } from './year-options.service';
import { CreateYearOptionDto } from '../../dto/create-year-option.dto';
import { UpdateYearOptionDto } from '../../dto/update-year-option.dto';
import { YearOption } from 'src/entities/year.entity';

@ApiTags('YearOptions')
@Controller('year-options')
export class YearOptionsController {
    constructor(private readonly service: YearOptionsService) {}

    @Get()
    findAll(): Promise<YearOption[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<YearOption> {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateYearOptionDto): Promise<YearOption> {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateYearOptionDto): Promise<YearOption> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.service.delete(id);
    }
}
