import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
