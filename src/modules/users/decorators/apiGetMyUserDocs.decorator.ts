import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponsePrivateUserDto } from 'src/DTOs/usersDto/responses-user.dto';
import { unauthorizedResponse } from '../swagger/unauthorizedResponse.swagger';

export const ApiGetMyUserDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get my user data.' }),
    ApiResponse({
      status: 200,
      description: 'User found successfully',
      type: ResponsePrivateUserDto,
      example: {
        data: {
          id: 'b9a8419e-0541-4f8e-a31a-930d52933adf',
          name: 'Ana Gómez',
          email: 'ana.gomez@example.com',
          phone: 987654321,
          country: 'Argentina',
          city: 'Córdoba',
          address: 'Av. Siempre Viva 742',
          role: 'premium',
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
    ApiResponse(unauthorizedResponse),
  );
};
