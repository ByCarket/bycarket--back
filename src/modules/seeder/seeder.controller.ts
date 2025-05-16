import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SeederService } from './seeder.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Seeder')
@Controller('seeder')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('brands')
  @ApiOperation({ summary: 'Seed de marcas únicas desde archivo JSON' })
  @ApiResponse({ status: 201, description: 'Marcas cargadas exitosamente' })
  async seedBrands() {
    return this.seederService.seedBrands();
  }

  @Post('models')
  @ApiOperation({ summary: 'Seed de modelos asociados a marcas existentes' })
  @ApiResponse({ status: 201, description: 'Modelos cargados exitosamente' })
  async seedModels() {
    return this.seederService.seedModels();
  }

  @Post('versions')
  @ApiOperation({ summary: 'Seed de versiones asociadas a modelos' })
  @ApiResponse({ status: 201, description: 'Versiones cargadas exitosamente' })
  async seedVersions() {
    return this.seederService.seedVersions();
  }
}
