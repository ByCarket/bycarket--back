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
import { VersionsService } from './versions.service';
import { CreateVersionDto } from 'src/DTOs/vehicleDto/seederDto/create-version.dto';
import { UpdateVersionDto } from 'src/DTOs/vehicleDto/seederDto/update-version.dto';
import { Version } from 'src/entities/version.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { Public } from 'src/decorators/publicRoutes.decorator';

@ApiTags('Versions')
@ApiBearerAuth()
@Controller('versions')
@UseGuards(AuthGuard, RolesGuard)
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
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateVersionDto): Promise<Version> {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateVersionDto): Promise<Version> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.delete(id);
  }
}
