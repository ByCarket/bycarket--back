import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './createCustomer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
