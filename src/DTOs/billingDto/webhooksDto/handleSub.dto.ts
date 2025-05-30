import { IsNotEmpty, IsString } from 'class-validator';

export class HandleSubDto {
  @IsNotEmpty()
  raw: Buffer;

  @IsNotEmpty()
  @IsString()
  signature: string;
}
