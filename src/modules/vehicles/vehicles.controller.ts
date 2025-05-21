import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateVehicleDto } from 'src/DTOs/vehicleDto/createVehicle.dto';
import { UpdateVehicleDto } from 'src/DTOs/vehicleDto/updateVehicle.dto';
import { Vehicle } from 'src/entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener todos los vehículos (paginado)' })
  @ApiResponse({ status: 200, description: 'Listado de vehículos' })
  async getVehicles(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): Promise<Vehicle[]> {
    return this.vehiclesService.getVehicles(parseInt(page, 10), parseInt(limit, 10));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener vehículo por ID' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado' })
  async getVehicleById(
    @UserAuthenticated('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.vehiclesService.getVehicleById(id, userId);
  }

  @UseGuards(AuthGuard) // solo requiere que el usuario esté logueado
  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo vehículo asignado al usuario autenticado' })
  @ApiResponse({ status: 201, description: 'Vehículo creado correctamente' })
  @ApiResponse({ status: 404, description: 'Marca, modelo o versión no encontrada' })
  async createVehicle(
    @UserAuthenticated('sub') userId: string,
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.createVehicle(createVehicleDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar vehículo existente (incluye año y versión)' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo a actualizar' })
  @ApiResponse({ status: 200, description: 'Vehículo actualizado' })
  @ApiResponse({ status: 404, description: 'Vehículo o entidad relacionada no encontrada' })
  async updateVehicle(
    @Param('id', ParseUUIDPipe) id: string,
    @UserAuthenticated('sub') userId: string,
    @Body() updateVehicleInfo: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.updateVehicle(id, userId, updateVehicleInfo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vehículo por ID' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo a eliminar' })
  @ApiResponse({ status: 200, description: 'Vehículo eliminado exitosamente' })
  async deleteVehicle(
    @UserAuthenticated('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.vehiclesService.deleteVehicle(id, userId);
  }
}
