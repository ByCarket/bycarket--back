import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Brand } from './brand.entity';
import { Model } from './model.entity';
import { YearOption } from './year.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => Brand)
  brand: Brand;

  @ManyToOne(() => Model)
  model: Model;

  @ManyToOne(() => YearOption)
  yearOption: YearOption;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  mileage: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  photos: string[]; // Almacenará un array de URLs como JSON
}
