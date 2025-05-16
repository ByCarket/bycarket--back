import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { unauthorizedResponse } from '../swagger/unauthorizedResponse.swagger';
import { idResponse } from '../swagger/idResponse.swagger';
import { userNotFound } from '../swagger/userNotFound.swagger';
import { forbiddenResponse } from '../swagger/forbiddenResponse.swagger';
import { goneResponse } from '../swagger/goneResponse.swagger';

export const ApiDeleteMyUserDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete my user.' }),
    ApiResponse(idResponse('deleted')),
    ApiResponse(unauthorizedResponse),
    ApiResponse(userNotFound),
    ApiResponse(
      forbiddenResponse('admin', "You can't delete an admin user.", 'Cannot delete an admin user.'),
    ),
    ApiResponse(goneResponse),
  );
};
