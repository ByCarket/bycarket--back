import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { Model } from './model.entity';
import { YearOption } from './year.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Brand, { onDelete: 'SET NULL', nullable: true })
  brand: Brand;

  @ManyToOne(() => Model, { onDelete: 'SET NULL', nullable: true })
  model: Model;

  @ManyToOne(() => YearOption, { onDelete: 'SET NULL', nullable: true })
  yearOption: YearOption;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  mileage: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  photos: string[]; // Array de URLs (JSON)
}

