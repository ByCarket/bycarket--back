import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Version } from 'src/entities/version.entity';
import { Model } from 'src/entities/model.entity';
import { VersionsService } from './versions.service';
import { VersionsController } from './versions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Version, Model])],
    providers: [VersionsService],
    controllers: [VersionsController],
})
export class VersionsModule {}
