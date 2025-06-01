import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Role } from '../enums/roles.enum';
import { Post } from './post.entity';
import { Question } from './question.entity';
import { Vehicle } from './vehicle.entity';
import { CloudinaryUserImage } from 'src/interfaces/cloudinaryUserImage.interface';
import { Invoice } from './invoice.entity';
import { Subscription } from './subscription.entity';
import { PhoneNumber } from 'src/interfaces/phone.interface';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  password: string;

  @Column({
    type: 'simple-json',
    nullable: true,
    comment: 'Phone number with country code, area code, and number',
  })
  phone: PhoneNumber;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  address: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  activationToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  activationTokenExpires: Date | null;

  @Column({
    type: 'simple-json',
    nullable: true,
    default: {
      secure_url:
        'https://res.cloudinary.com/dps04b1up/image/upload/v1748807133/bodsjo0usufkr0svhblj.png',
    },
  })
  image: CloudinaryUserImage;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'varchar', length: 100, nullable: true })
  googleId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  stripeCustomerId: string;

  @Column({ type: 'varchar', nullable: true })
  subscription_active: string | null;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Question, question => question.user)
  questions: Question[];

  @OneToMany(() => Vehicle, vehicle => vehicle.user)
  vehicles: Vehicle[];

  @OneToMany(() => Invoice, invoice => invoice.user)
  invoices: Invoice[];

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions: Subscription[];
}
