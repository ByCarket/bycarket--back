import { ResponseIdDto } from 'src/dto/usersDto/responses-user.dto';

export const idResponse = (action: string) => {
  return {
    status: 200,
    description: `User ${action} successfully`,
    type: ResponseIdDto,
    example: {
      data: 'asfed-1234-5678-90ab-cdef12345678',
      message: `User ${action} successfully`,
    },
  };
};
