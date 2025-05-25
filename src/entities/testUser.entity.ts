// src/entities/testUser.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('test_users')
export class TestUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint' })
  meliUserId: number;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column({ default: 'buyer' }) // o 'seller'
  type: string;
}
