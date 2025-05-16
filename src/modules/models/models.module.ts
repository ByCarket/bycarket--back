import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from 'src/entities/model.entity';
import { Brand } from 'src/entities/brand.entity';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Model, Brand])],
    providers: [ModelsService],
    controllers: [ModelsController],
})
export class ModelsModule {}
