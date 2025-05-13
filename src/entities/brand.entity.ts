/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Model } from './model.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ unique: true, type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => Model, (model) => model.brand, { cascade: true })
  models: Model[];
}
