import { ResponseIdDto } from 'src/DTOs/usersDto/responses-user.dto';

export const idResponse = (action: string) => {
  return {
    status: 200,
    description: `Upload ${action} successfully`,
    type: ResponseIdDto,
    example: {
      data: 'asfed-1234-5678-90ab-cdef12345678',
      message: `Upload ${action} successfully`,
    },
  };
};
