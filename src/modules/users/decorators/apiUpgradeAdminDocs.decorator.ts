import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { idResponse } from '../swagger/idResponse.swagger';
import { unauthorizedResponse } from '../swagger/unauthorizedResponse.swagger';
import { forbiddenResponse } from '../swagger/forbiddenResponse.swagger';
import { userNotFound } from '../swagger/userNotFound.swagger';
import { paramId } from '../swagger/paramId.swagger';

export const ApiUpgradeAdminDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Upgrade user to admin',
    }),
    ApiParam(paramId('User ID')),
    ApiResponse(idResponse('upgraded to admin')),
    ApiResponse(unauthorizedResponse),
    ApiResponse(forbiddenResponse('admin')),
    ApiResponse(userNotFound),
  );
};
