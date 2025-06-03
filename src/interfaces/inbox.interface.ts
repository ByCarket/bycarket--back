import { User } from 'src/entities/user.entity';

export interface Inbox {
  user: User;
  lastMessage: string;
  created_at: Date;
  unreadCount: number;
}
