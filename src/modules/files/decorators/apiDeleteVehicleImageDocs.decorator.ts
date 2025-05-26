import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

export function ApiDeleteVehicleImageDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Eliminar una imagen de un vehículo' }),
    ApiParam({
      name: 'vehicleId',
      description: 'ID único del vehículo (UUID)',
      type: String,
      format: 'uuid',
      required: true,
    }),
    ApiParam({
      name: 'publicId',
      description: 'ID público de la imagen en Cloudinary',
      type: String, 
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Imagen del vehículo eliminada exitosamente',
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
    }),
    ApiResponse({
      status: 404,
      description: 'Vehículo o imagen no encontrada',
    }),
  );
}