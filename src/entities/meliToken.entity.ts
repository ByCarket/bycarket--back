import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'meli_tokens' })
export class MeliToken {
  @ApiProperty({ example: 'a1b2c3d4-1234-5678-9101-abcdefabcdef', description: 'ID único del token' })
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ApiProperty({ example: 'mluser123456', description: 'ID del usuario en Mercado Libre' })
  @Column({ type: 'varchar', length: 100 })
  meliUserId: string;

  @ApiProperty({ example: 'APP_USR-1234567890abcdef', description: 'Access token para autenticar con Mercado Libre' })
  @Column({ type: 'text' })
  accessToken: string;

  @ApiProperty({ example: 'TG-abcdefabcdefabcdef', description: 'Refresh token para renovar el access token' })
  @Column({ type: 'text' })
  refreshToken: string;

  @ApiProperty({ example: '2025-05-23T20:50:00.000Z', description: 'Fecha de expiración del token' })
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ApiProperty({ description: 'Usuario al que pertenece este token' })
  @ManyToOne(() => User, (user) => user.meliTokens, { onDelete: 'CASCADE', eager: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
