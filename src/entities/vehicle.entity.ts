import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { Model } from './model.entity';
import { User } from './user.entity';
import { Version } from './version.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  user: User;

  @ManyToOne(() => Brand, { onDelete: 'SET NULL', nullable: true })
  brand: Brand;

  @ManyToOne(() => Model, { onDelete: 'SET NULL', nullable: true })
  model: Model;

  @ManyToOne(() => Version, { onDelete: 'SET NULL', nullable: true })
  version: Version;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  mileage: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  photos: string[]; // Array de URLs (JSON)
}
