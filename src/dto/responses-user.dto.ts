import { User } from 'src/entities/user.entity';

export class ResponseIdDto {
  data: string;
  message: string;
}

export class ResponsePrivateUserDto {
  data: Omit<User, 'password'>;
  message: string;
}

export class ResponsePublicUserDto {
  data: Omit<User, 'password' | 'role' | 'questions'>;
  message: string;
}

export class ResponsePagUsersDto {
  data: Omit<User, 'password'>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
