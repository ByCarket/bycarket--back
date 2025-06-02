import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => User, user => user.sentMessages, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  receiver: User;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ type: 'date', default: new Date() })
  created_at: Date;

  @Column({ type: 'varchar', nullable: false })
  roomId: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;
}
