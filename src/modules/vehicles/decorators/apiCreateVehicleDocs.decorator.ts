import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateVehicleDto } from 'src/DTOs/vehicleDto/createVehicle.dto';

export function ApiCreateVehicleDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear un vehículo con imagenes' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Crea un vehículo con imágenes',
      type: CreateVehicleDto,
    }),
    ApiResponse({
      status: 200,
      description: 'Vehiculo creado exitosamente',
    }),
  );
}
