import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { StatusInvoice } from 'src/enums/statusInvoice.enum';

@Entity('invoices')
export class Invoice {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, user => user.invoices, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar' })
  hosted_invoice_url: string;

  @Column({ type: 'varchar' })
  invoice_pdf: string;

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
  period_end: Date;

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
  period_start: Date;

  @Column({
    nullable: true,
    type: 'enum',
    enum: StatusInvoice,
  })
  status: StatusInvoice | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value / 100,
      from: (value: string) => value,
    },
  })
  total: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value / 100,
      from: (value: string) => value,
    },
  })
  amount_paid: number;
}
