import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StatusSubscription } from 'src/enums/statusSubscription.enum';
import { Timestamp } from 'typeorm';

export class SubscriptionDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Expose()
  latest_invoice: string | null;

  @Expose()
  @IsNotEmpty()
  @IsEnum(StatusSubscription)
  status: StatusSubscription;

  @Expose()
  cancel_at: Timestamp | null;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  cancel_at_period_end: boolean;

  @Expose()
  canceled_at: Timestamp | null;

  @Expose()
  ended_at: Timestamp | null;
}
