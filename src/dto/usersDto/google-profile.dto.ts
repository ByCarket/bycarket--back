import { IsEmail, IsString } from 'class-validator';

export class GoogleProfileDto {
  @IsString()
  sub: string;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;
}
