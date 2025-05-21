// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { v4 as uuid } from 'uuid';
// import { Version } from './version.entity';

// @Entity('year_options')
// export class YearOption {
//   @PrimaryGeneratedColumn('uuid')
//   id: string = uuid();

//   @Column({ type: 'int' })
//   year: number;

//   @ManyToOne(() => Version, (version) => version.yearOptions)
//   version: Version;
// }
