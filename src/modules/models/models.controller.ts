import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { CreateModelDto } from 'src/DTOs/vehicleDto/seederDto/create-model.dto';
import { UpdateModelDto } from 'src/DTOs/vehicleDto/seederDto/update-model.dto';
import { Model } from 'src/entities/model.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Public } from 'src/decorators/publicRoutes.decorator';

@ApiTags('Models')
@Controller('models')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
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
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateModelDto): Promise<Model> {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateModelDto): Promise<Model> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.delete(id);
  }
}
