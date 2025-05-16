import { ApiResponseOptions } from '@nestjs/swagger';

export const badRequestResponse: ApiResponseOptions = {
  status: 400,
  description: 'Validation failed',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      message: { type: 'string' },
      alert: { type: 'string' },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            property: { type: 'string' },
            constraints: {
              type: 'object',
              additionalProperties: { type: 'string' },
            },
          },
        },
      },
    },
    example: {
      statusCode: 400,
      message: 'Bad Request Exception',
      alert: 'The following errors were made in the request:',
      errors: [
        {
          property: 'phone',
          constraints: {
            isNumber: 'phone must be a number',
          },
        },
        {
          property: 'country',
          constraints: {
            minLength: 'country must be longer than or equal to 5 characters',
          },
        },
      ],
    },
  },
};
