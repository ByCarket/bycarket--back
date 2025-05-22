import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateVehicleImgDto } from 'src/DTOs/filesDto/updateVehicleImg.dto';

export function ApiUploadVehicleImagesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Subir imágenes para un vehículo' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Sube imágenes para un vehículo específico',
      type: UpdateVehicleImgDto
    }),
    ApiResponse({
      status: 200,
      description: 'Imágenes del vehículo cargadas exitosamente',
    }),
  );
}
