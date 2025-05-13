import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Model } from './model.entity';
import { YearOption } from './year.entity';

@Entity('versions')
export class Version {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToOne(() => Model, (model) => model.versions)
  model: Model;

  @OneToMany(() => YearOption, (yearOption) => yearOption.version)
  yearOptions: YearOption[];
}
