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
import { Public } from 'src/decorators/publicRoutes.decorator';

@ApiTags('Brands')
@Controller('brands')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class BrandsController {
  constructor(private readonly service: BrandsService) {}

  @Public()
  @Get()
  findAll(): Promise<Brand[]> {
    return this.service.findAll();
  }

  @Public()
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
