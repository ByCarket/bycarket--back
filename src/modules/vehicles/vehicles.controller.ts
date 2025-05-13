// vehicles.controller.ts

import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Param, 
    Body, 
    Query, 
    HttpCode, 
    ParseUUIDPipe 
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from 'src/entities/vehicle.entity';
import { CreateVehicleDto } from '../../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../../dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    // ✅ GET all vehicles
    @Get()
    @HttpCode(200)
    async getVehicles(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5',
    ): Promise<Vehicle[]> {
        const pageNumber: number = parseInt(page, 10) || 1;
        const limitNumber: number = parseInt(limit, 10) || 5;
        return this.vehiclesService.getVehicles(pageNumber, limitNumber);
    }

    // ✅ GET vehicle by id
    @Get(':id')
    async getVehicleById(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<Vehicle> {
        return this.vehiclesService.getVehicleById(id);
    }

    // ✅ POST create vehicle
    @Post()
    async createVehicle(
        @Body() createVehicleDto: CreateVehicleDto
    ): Promise<Vehicle> {
        return this.vehiclesService.createVehicle(createVehicleDto);
    }

    // ✅ PUT update vehicle
    @Put(':id')
    async updateVehicle(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateVehicleDto: UpdateVehicleDto
    ): Promise<Vehicle> {
        return this.vehiclesService.updateVehicle(id, updateVehicleDto);
    }

    // ✅ DELETE vehicle
    @Delete(':id')
    async deleteVehicle(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<void> {
        return this.vehiclesService.deleteVehicle(id);
    }
}
