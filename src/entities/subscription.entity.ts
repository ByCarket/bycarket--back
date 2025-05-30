import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { StatusSubscription } from 'src/enums/statusSubscription.enum';
import { Invoice } from './invoice.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, user => user.subscriptions)
  user: User;

  @OneToMany(() => Invoice, invoice => invoice.subscription)
  invoices: Invoice[];

  @Column({ type: 'varchar' })
  latest_invoice: string;

  @Column({ type: 'enum', enum: StatusSubscription })
  status: StatusSubscription;

  @Column({
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
  cancel_at: Date;

  @Column({ type: 'boolean' })
  cancel_at_period_end: boolean;

  @Column({
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
  canceled_at: Date;

  @Column({
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
  ended_at: Date;
}
