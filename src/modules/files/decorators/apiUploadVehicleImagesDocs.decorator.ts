import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseIdDto } from 'src/DTOs/usersDto/responses-user.dto';
import { CreateVehicleDto } from 'src/DTOs/vehicleDto/createVehicle.dto';

export function ApiUploadVehicleImagesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Subir imágenes para un vehículo' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Sube imágenes para un vehículo específico',
      type: CreateVehicleDto,
    }),
    ApiResponse({
      status: 200,
      description: 'Imágenes del vehículo cargadas exitosamente',
      type: ResponseIdDto,
    }),
  );
}
