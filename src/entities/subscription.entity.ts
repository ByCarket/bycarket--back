import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { StatusSubscription } from 'src/enums/statusSubscription.enum';
import { Invoice } from './invoice.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, user => user.subscriptions, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  started_at: Date;

  @Column({ type: 'varchar', nullable: true })
  latest_invoice: string | null;

  @Column({ type: 'enum', enum: StatusSubscription })
  status: StatusSubscription;

  @Column({
    nullable: true,
    type: 'timestamptz',
    transformer: {
      to: (value: number | Date) => {
        if (typeof value === 'number') {
          return new Date(value * 1000);
        }
        return value;
      },
      from: (value: Date) => value,
    },
  })
  cancel_at: Date | null;

  @Column({ type: 'boolean' })
  cancel_at_period_end: boolean;

  @Column({
    nullable: true,
    type: 'timestamp',
    transformer: {
      to: (value: number | Date) => {
        if (typeof value === 'number') {
          return new Date(value * 1000);
        }
        return value;
      },
      from: (value: Date) => value,
    },
  })
  canceled_at: Date | null;

  @Column({
    nullable: true,
    type: 'timestamp',
    transformer: {
      to: (value: number | Date) => {
        if (typeof value === 'number') {
          return new Date(value * 1000);
        }
        return value;
      },
      from: (value: Date) => value,
    },
  })
  ended_at: Date | null;
}
