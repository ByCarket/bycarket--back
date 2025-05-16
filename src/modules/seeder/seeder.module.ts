import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { Brand } from '../../entities/brand.entity';
import { Model } from '../../entities/model.entity';
import { Version } from '../../entities/version.entity';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([Brand, Model, Version]),AuthModule],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}


