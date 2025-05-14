import { User } from 'src/entities/user.entity';

export class ResponseIdDto {
  data: string;
  message: string;
}

export class ResponseUserDto {
  data: Omit<User, 'password' | 'role'>;
  message: string;
}

export class ResponsePagUsersDto {
  data: Omit<User, 'password' | 'role'>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
