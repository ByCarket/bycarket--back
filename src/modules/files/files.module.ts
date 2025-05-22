import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { cloudinaryConfig } from 'src/config/cloudinary.config';
import { Vehicle } from 'src/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Vehicle])],
  controllers: [FilesController],
  providers: [FilesService, cloudinaryConfig],
  exports: [FilesService],
})
export class FilesModule {}
