import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../usersDto/createUser.dto';

export class SellerInfoDto extends PickType(CreateUserDto, ['name', 'phone']) {}
