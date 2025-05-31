import { User } from 'src/entities/user.entity';
import { SubscriptionDto } from './subscription.dto';

export class HandleSubscriptionDto {
  user: User;
  subscriptionDto: SubscriptionDto;
}
