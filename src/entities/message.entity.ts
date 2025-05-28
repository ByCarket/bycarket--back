import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => User, user => user.sentMessages, { eager: true })
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages, { eager: true })
  receiver: User;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    default: false,
  })
  isRead: boolean;
}
