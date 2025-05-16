import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VersionsService } from './versions.service';
import { CreateVersionDto } from '../../dto/create-version.dto';
import { UpdateVersionDto } from '../../dto/update-version.dto';
import { Version } from 'src/entities/version.entity';

@ApiTags('Versions')
@Controller('versions')
export class VersionsController {
    constructor(private readonly service: VersionsService) {}

    @Get()
    findAll(): Promise<Version[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Version> {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateVersionDto): Promise<Version> {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateVersionDto): Promise<Version> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.service.delete(id);
    }
}
