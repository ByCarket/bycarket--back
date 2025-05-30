import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StatusSubscription } from 'src/enums/statusSubscription.enum';
import { Timestamp } from 'typeorm';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  latest_invoice: string | null;

  @IsNotEmpty()
  @IsEnum(StatusSubscription)
  status: StatusSubscription;

  cancel_at: Timestamp | null;

  @IsNotEmpty()
  @IsBoolean()
  cancel_at_period_end: boolean;

  canceled_at: Timestamp | null;
}
