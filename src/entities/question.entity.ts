import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => Post, (post) => post.questions)
  post: Post;

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  date: Date;
}
