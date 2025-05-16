import { ForbiddenException } from '@nestjs/common';

export const forbiddenResponse = (role: string, description?: string, message?: string) => {
  return {
    status: 403,
    description: description
      ? description
      : `Forbidden endpoint. You must be an ${role} to access this endpoint.`,
    type: ForbiddenException,
    example: {
      statusCode: 403,
      message: message
        ? message
        : "You don't have permission and aren't allowed to access this route.",
      error: 'Forbidden',
    },
  };
};
