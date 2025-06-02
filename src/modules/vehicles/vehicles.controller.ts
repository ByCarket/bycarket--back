import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateVehicleDto } from 'src/DTOs/vehicleDto/createVehicle.dto';
import { UpdateVehicleDto } from 'src/DTOs/vehicleDto/updateVehicle.dto';
import { Vehicle } from 'src/entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiCreateVehicleDocs } from './decorators/apiCreateVehicleDocs.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener todos los vehículos (paginado)' })
  @ApiResponse({ status: 200, description: 'Listado de vehículos' })
  async getVehicles(
    @UserAuthenticated('sub') id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): Promise<Vehicle[]> {
    return this.vehiclesService.getVehicles(parseInt(page, 10), parseInt(limit, 10), id);
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

  @Post()
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiCreateVehicleDocs()
  async createVehicle(
    @UserAuthenticated('sub') userId: string,
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000, message: 'Images must not exceed 5Mb.' }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)/ }),
        ],
        fileIsRequired: true,
      }),
    )
    files: Express.Multer.File[],
  ) {
    // Asociar las imágenes al DTO
    createVehicleDto.images = files;
    return this.vehiclesService.createVehicleWithImages(createVehicleDto, userId);
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
  ) {
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
