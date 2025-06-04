import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../usersDto/createUser.dto';
import { Expose } from 'class-transformer';

export class SellerInfoDto extends PickType(CreateUserDto, [ 'name', 'phone'] as const) {
  @Expose()
  id: string;
}
