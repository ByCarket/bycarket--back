import { NotFoundException } from '@nestjs/common';

export const userNotFound = {
  status: 404,
  description: 'User not found',
  type: NotFoundException,
  example: {
    statusCode: 404,
    message: 'User with ID 123e4567-e89b-12d3-a456-426614174000 not found.',
    error: 'Not Found',
  },
};
