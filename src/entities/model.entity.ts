import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Brand } from './brand.entity';
import { Version } from './version.entity';

@Entity('models')
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ unique: true, type: 'varchar', length: 50 })
  name: string;

  @ManyToOne(() => Brand, (brand) => brand.models)
  brand: Brand;

  @OneToMany(() => Version, (version) => version.model)
  versions: Version[];
}
