import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { CreateModelDto } from '../../dto/create-model.dto';
import { UpdateModelDto } from '../../dto/update-model.dto';
import { Model } from 'src/entities/model.entity';

@ApiTags('Models')
@Controller('models')
export class ModelsController {
    constructor(private readonly service: ModelsService) {}

    @Get()
    findAll(): Promise<Model[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Model> {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateModelDto): Promise<Model> {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateModelDto): Promise<Model> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.service.delete(id);
    }
}
