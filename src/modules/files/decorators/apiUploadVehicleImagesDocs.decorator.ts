import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseIdDto } from 'src/DTOs/usersDto/responses-user.dto';

export function ApiUploadVehicleImagesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Subir imágenes para un vehículo' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Imágenes del vehículo cargadas exitosamente',
      type: ResponseIdDto,
    }),
  );
}
