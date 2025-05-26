import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEnum } from '../enums/currency.enum';
import { Brand } from './brand.entity';
import { Model } from './model.entity';
import { User } from './user.entity';
import { Version } from './version.entity';
import { VehicleTypeEnum } from '../enums/vehicleType.enum';
import { VehicleCondition } from 'src/enums/vehicleCondition.enum';
import { CloudinaryVehicleImage } from 'src/interfaces/cloudinaryImage.interface';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Brand, { onDelete: 'SET NULL', nullable: true })
  brand: Brand;

  @ManyToOne(() => Model, { onDelete: 'SET NULL', nullable: true })
  model: Model;

  @ManyToOne(() => Version, { onDelete: 'SET NULL', nullable: true })
  version: Version;

  @Column({ type: 'enum', enum: VehicleTypeEnum })
  typeOfVehicle: VehicleTypeEnum;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'enum', enum: VehicleCondition })
  condition: VehicleCondition;

  @Column({ type: 'enum', enum: CurrencyEnum })
  currency: CurrencyEnum;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int', nullable: true })
  mileage: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  images: CloudinaryVehicleImage[]; // Array de URLs (JSON)
}
