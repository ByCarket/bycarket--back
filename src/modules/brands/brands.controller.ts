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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from 'src/DTOs/vehicleDto/seederDto/create-brand.dto';
import { UpdateBrandDto } from 'src/DTOs/vehicleDto/seederDto/update-brand.dto';
import { Brand } from 'src/entities/brand.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('Brands')
@Controller('brands')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
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

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateBrandDto): Promise<Brand> {
    return this.service.create(dto);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBrandDto): Promise<Brand> {
    return this.service.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.delete(id);
  }
}
