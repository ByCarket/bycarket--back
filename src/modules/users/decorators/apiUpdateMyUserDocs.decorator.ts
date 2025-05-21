import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { UpdateUserInfoDto } from 'src/DTOs/usersDto/updateUserInfo.dto';
import { unauthorizedResponse } from '../swagger/unauthorizedResponse.swagger';
import { userNotFound } from '../swagger/userNotFound.swagger';
import { idResponse } from '../swagger/idResponse.swagger';
import { badRequestResponse } from '../swagger/badRequestResponse.swagger';

export const ApiUpdateMyUserDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update my user',
    }),
    ApiBody({
      description: 'User data to update',
      required: true,
      schema: {
        oneOf: [{ $ref: getSchemaPath(UpdateUserInfoDto) }],
      },
      examples: {
        'Update name': {
          summary: 'Update name only',
          description: 'Updates only the user name',
          value: {
            name: 'Jane Doe',
          },
        },
        'Update adress and phone': {
          summary: 'Update address and phone',
          description: 'Updates the user address and phone number',
          value: {
            address: '456 Park Avenue',
            phone: 9876543210,
          },
        },
        'Update location': {
          summary: 'Update country and city',
          description: 'Updates the user country and city of residence',
          value: {
            country: 'Canada',
            city: 'Toronto',
          },
        },
        'Update all fields': {
          summary: 'Update all editable fields',
          description: 'Updates all user fields that are allowed to be modified',
          value: {
            name: 'Michael Scott',
            address: '1725 Slough Avenue',
            phone: 1122334455,
            country: 'United States',
            city: 'Scranton',
          },
        },
      },
    }),
    ApiResponse(idResponse('updated')),
    ApiResponse(badRequestResponse),
    ApiResponse(unauthorizedResponse),
    ApiResponse(userNotFound),
  );
};
