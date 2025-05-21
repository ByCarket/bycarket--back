import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ResponsePagUsersDto } from 'src/DTOs/usersDto/responses-user.dto';
import { unauthorizedResponse } from '../swagger/unauthorizedResponse.swagger';
import { forbiddenResponse } from '../swagger/forbiddenResponse.swagger';

export const apiGetUsersDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users.' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of users per page',
    }),
    ApiResponse({
      status: 200,
      description: 'Users found',
      isArray: true,
      type: ResponsePagUsersDto,
      example: {
        data: [
          {
            id: 'a3f2f1d9-9d62-4f31-bc52-8dbfa58c124a',
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            phone: 123456789,
            country: 'Argentina',
            city: 'Buenos Aires',
            address: 'Calle Falsa 123',
            isActive: true,
            role: 'user',
          },
          {
            id: 'b9a8419e-0541-4f8e-a31a-930d52933adf',
            name: 'Ana Gómez',
            email: 'ana.gomez@example.com',
            phone: 987654321,
            country: 'Argentina',
            city: 'Córdoba',
            address: 'Av. Siempre Viva 742',
            isActive: true,
            role: 'premium',
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    }),
    ApiResponse(unauthorizedResponse),
    ApiResponse(forbiddenResponse('admin')),
  );
};
// This decorator is used to document the API endpoint for getting all users.
