import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { Question } from './question.entity';
import { PostStatus } from 'src/enums/postStatus.enum';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  vehicle: Vehicle;

  @CreateDateColumn()
  postDate: Date;

  @Column({
    type: 'enum',
    enum: ['Active', 'Inactive', 'Rejected', 'Pending', 'Sold'],
    default: 'Pending',
  })
  status: PostStatus;

  @OneToMany(() => Question, question => question.post)
  questions: Question[];

  @Column({ type: 'varchar', nullable: true })
meliItemId: string | null;
}
