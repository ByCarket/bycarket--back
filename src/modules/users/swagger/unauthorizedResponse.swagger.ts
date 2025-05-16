import { UnauthorizedException } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export const unauthorizedResponse: ApiResponseOptions = {
  status: 401,
  description: 'Unauthorized endpoint. You must be logged in to access this endpoint.',
  type: UnauthorizedException,
  example: {
    statusCode: 401,
    message: 'No token provided',
    error: 'Unauthorized',
  },
};
