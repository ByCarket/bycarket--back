import { applyDecorators, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { idResponse } from '../swagger/idResponse.swagger';
import { unauthorizedResponse } from 'src/modules/users/swagger/unauthorizedResponse.swagger';
import { userNotFound } from 'src/modules/users/swagger/userNotFound.swagger';

export const ApiUserProfileDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Upload user profile.' }),
    ApiResponse(idResponse('user image')),
    ApiResponse({
      status: 400,
      description: 'The file must not exceed 200kb and must be in jpg, jpeg, png, webp format.',
      type: BadRequestException,
      example: {
        message: 'The file must not exceed 200kb.',
        error: 'Bad Request',
        statusCode: 400,
      },
    }),
    ApiResponse(unauthorizedResponse),
    ApiResponse(userNotFound),
    ApiBody({
      description: 'Image file to upload (jpg, jpeg, png, webp). Max size: 2KB.',
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
            description: 'Image file (must not exceed 2KB).',
          },
        },
        required: ['image'],
      },
    }),
    ApiConsumes('multipart/form-data'),
  );
};
