import { GoneException } from '@nestjs/common';

export const goneResponse = {
  description: 'User has already been deleted.',
  status: 410,
  type: GoneException,
  example: {
    statusCode: 410,
    message: 'User has already been deleted.',
    error: 'Gone',
  },
};
