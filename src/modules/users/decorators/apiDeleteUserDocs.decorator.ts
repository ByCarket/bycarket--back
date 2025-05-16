import { applyDecorators, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { idResponse } from '../swagger/idResponse.swagger';
import { unauthorizedResponse } from '../swagger/unauthorizedResponse.swagger';
import { forbiddenResponse } from '../swagger/forbiddenResponse.swagger';
import { paramId } from '../swagger/paramId.swagger';
import { userNotFound } from '../swagger/userNotFound.swagger';
import { goneResponse } from '../swagger/goneResponse.swagger';

export const ApiDeleteUserDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete user by id.',
    }),
    ApiParam(paramId('User ID')),
    ApiResponse(idResponse('deleted')),
    ApiResponse(unauthorizedResponse),
    ApiResponse(forbiddenResponse('admin')),
    ApiResponse(userNotFound),
    ApiResponse(goneResponse),
  );
};
