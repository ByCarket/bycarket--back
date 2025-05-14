// src/modules/vehicles/vehicles.controller.ts
import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateVehicleDto } from 'src/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/dto/update-vehicle.dto';
import { Vehicle } from 'src/entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';

@ApiTags('Vehicles') // 👉 Este es el tag que se verá en Swagger UI
@Controller('vehicles')
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
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<Vehicle> {
        return this.vehiclesService.getVehicleById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo vehículo' })
    @ApiResponse({ status: 201, description: 'Vehículo creado exitosamente' })
    async createVehicle(
        @Body() createVehicleDto: CreateVehicleDto
    ): Promise<Vehicle> {
        return this.vehiclesService.createVehicle(createVehicleDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un vehículo existente' })
    @ApiParam({ name: 'id', description: 'UUID del vehículo a actualizar' })
    @ApiResponse({ status: 200, description: 'Vehículo actualizado exitosamente' })
    async updateVehicle(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateVehicleDto: UpdateVehicleDto
    ): Promise<Vehicle> {
        return this.vehiclesService.updateVehicle(id, updateVehicleDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un vehículo por ID' })
    @ApiParam({ name: 'id', description: 'UUID del vehículo a eliminar' })
    @ApiResponse({ status: 200, description: 'Vehículo eliminado exitosamente' })
    async deleteVehicle(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<void> {
        return this.vehiclesService.deleteVehicle(id);
    }
}
