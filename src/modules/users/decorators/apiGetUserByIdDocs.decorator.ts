import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ResponsePublicUserDto } from 'src/DTOs/usersDto/responses-user.dto';
import { userNotFound } from '../swagger/userNotFound.swagger';
import { paramId } from '../swagger/paramId.swagger';

export const ApiGetUserByIdDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user by id',
    }),
    ApiParam(paramId('User ID')),
    ApiResponse({
      status: 200,
      description: 'User found',
      type: ResponsePublicUserDto,
      example: {
        data: {
          id: 'b9a8419e-0541-4f8e-a31a-930d52933adf',
          name: 'Ana Gómez',
          email: 'ana.gomez@example.com',
          phone: 987654321,
          country: 'Argentina',
          city: 'Córdoba',
          address: 'Av. Siempre Viva 742',
          posts: [
            {
              id: 'post-1-uuid',
              postDate: '2025-05-15T10:00:00.000Z',
              status: 'Active',
              questions: [
                {
                  id: 'question-1-uuid',
                  message: '¿Este auto tiene servicio al día?',
                  date: '2025-05-15T12:00:00.000Z',
                },
                {
                  id: 'question-2-uuid',
                  message: '¿Se puede financiar?',
                  date: '2025-05-15T13:30:00.000Z',
                },
              ],
            },
          ],
        },
        message: 'User found successfully',
      },
    }),
    ApiResponse(userNotFound),
  );
};
