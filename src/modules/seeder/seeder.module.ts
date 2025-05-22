import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { Brand } from '../../entities/brand.entity';
import { Model } from '../../entities/model.entity';
import { Version } from '../../entities/version.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Model, Version]), UsersModule],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
