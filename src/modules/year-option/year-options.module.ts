import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YearOption } from 'src/entities/year.entity';
import { Version } from 'src/entities/version.entity';
import { YearOptionsService } from './year-options.service';
import { YearOptionsController } from './year-options.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([YearOption, Version]),AuthModule],
    providers: [YearOptionsService],
    controllers: [YearOptionsController],
})
export class YearOptionsModule {}
