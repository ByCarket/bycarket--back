import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { CloudinaryVehicleImage } from 'src/interfaces/cloudinaryImage.interface';
import { Vehicle } from 'src/entities/vehicle.entity';
import { CreateVehicleDto } from 'src/DTOs/vehicleDto/createVehicle.dto';
import { UpdateVehicleDto } from 'src/DTOs/vehicleDto/updateVehicle.dto';
import { Brand } from 'src/entities/brand.entity';
import { Model } from 'src/entities/model.entity';
import { User } from 'src/entities/user.entity';
import { Version } from 'src/entities/version.entity';
import { MailService } from 'src/modules/mail-notification/mailNotificacion.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,

    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly filesService: FilesService,

    private readonly mailService: MailService,
  ) {}

  // ✅ GET all vehicles paginated
  async getVehicles(page: number, limit: number, userId: string): Promise<Vehicle[]> {
    const skip = (page - 1) * limit;
    return this.vehicleRepository.find({
      skip,
      take: limit,
      relations: ['brand', 'model', 'version'],
      where: {
        user: { id: userId },
      },
    });
  }

  // ✅ GET vehicle by id
  async getVehicleById(id: string, userId: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    if (vehicle.user && vehicle.user.id !== userId) {
      throw new ForbiddenException(
        `Vehicle with ID ${id} does not belong to user with ID ${userId}`,
      );
    }

    vehicle.user = {
      id: vehicle.user.id,
      name: vehicle.user.name,
      email: vehicle.user.email,
      phone: vehicle.user.phone,
      address: vehicle.user.address,
      city: vehicle.user.city,
      country: vehicle.user.country,
      image: vehicle.user.image,
    } as User;

    return {
      data: vehicle,
      message: 'Vehicle found',
    };
  }

  // ✅ CREATE vehicle
  async createVehicleWithImages(
    { images, brandId, modelId, versionId, ...CreateVehicleDto }: CreateVehicleDto,
    userId: string,
  ) {
    const queryRunner = this.vehicleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let uploadedImages: UploadApiResponse[] = [];
    const uploadPromises: Promise<UploadApiResponse>[] = images.map(image =>
      this.filesService.uploadImgCloudinary(image),
    );

    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      const brand = await this.brandRepository.findOneBy({ id: brandId });
      const model = await this.modelRepository.findOneBy({ id: modelId, brand: { id: brandId } });
      const version = await this.versionRepository.findOneBy({
        id: versionId,
        model: { id: modelId, brand: { id: brandId } },
      });

      if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
      if (!brand) throw new NotFoundException(`Brand with ID ${brandId} not found`);
      if (!model)
        throw new NotFoundException(`Model with ID ${modelId} not found for brand ${brandId}`);
      if (!version)
        throw new NotFoundException(
          `Version with ID ${versionId} not found for model ${modelId} and brand ${brandId}`,
        );

      const vehicle = this.vehicleRepository.create({
        brand,
        model,
        version,
        user,
        ...CreateVehicleDto,
      });

      if (images.length > 6) throw new BadRequestException('You can only upload up to 6 images');

      const uploadResults = await Promise.allSettled(uploadPromises);

      const hasErrors = uploadResults.some(result => result.status === 'rejected');
      uploadedImages = uploadResults
        .filter(
          (res): res is PromiseFulfilledResult<UploadApiResponse> => res.status === 'fulfilled',
        )
        .map(res => res.value);

      if (hasErrors) throw new InternalServerErrorException('Some images failed to upload');

      vehicle.images = uploadedImages.map(img => {
        return {
          public_id: img.public_id,
          secure_url: img.secure_url,
        };
      });

      await queryRunner.manager.save(vehicle);
      await queryRunner.commitTransaction();

      try {
        await this.mailService.sendVehicleCreatedNotification(user.email, user.name, {
          brand: brand.name,
          model: model.name,
          version: version.name,
          year: vehicle.year,
        });
      } catch (emailError) {
        console.error('Error enviando notificación de vehículo creado:', emailError);
      }

      vehicle.user = {
        id: vehicle.user.id,
        name: vehicle.user.name,
        email: vehicle.user.email,
      } as User;

      return {
        data: vehicle,
        message: 'Vehicle created successfully with images.',
      };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      if (uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map(img =>
            this.filesService.deleteCloudinaryImage(img.public_id).catch(() => null),
          ),
        );
      }
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Unexpected error creating vehicle');
      }
    } finally {
      await queryRunner.release();
    }
  }

  // ✅ UPDATE vehicle con notificación simple por email
  async updateVehicle(id: string, userId: string, updateVehicleInfo: UpdateVehicleDto) {
    // Obtener datos del vehículo ANTES del update
    const originalVehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['brand', 'model', 'version', 'user'],
    });

    if (!originalVehicle) throw new NotFoundException(`Vehicle with ID ${id} not found`);
    if (originalVehicle.user && originalVehicle.user.id !== userId) {
      throw new ForbiddenException(
        `Vehicle with ID ${id} does not belong to user with ID ${userId}`,
      );
    }

    // Guardar información del vehículo para el email
    const vehicleInfo = {
      brand: originalVehicle.brand.name,
      model: originalVehicle.model.name,
      version: originalVehicle.version.name,
      year: originalVehicle.year,
    };

    const userInfo = {
      email: originalVehicle.user.email,
      name: originalVehicle.user.name,
    };

    // Actualizar el vehículo
    await this.vehicleRepository.update(id, updateVehicleInfo);

    // ✅ Enviar notificación simple por email después de la actualización exitosa
    try {
      await this.mailService.sendVehicleUpdatedNotification(
        userInfo.email,
        userInfo.name,
        vehicleInfo,
      );
    } catch (emailError) {
      console.error('Error enviando notificación de vehículo actualizado:', emailError);
    }

    return {
      data: id,
      message: 'Vehicle updated successfully',
    };
  }

  // ✅ DELETE vehicle con notificación por email
  async deleteVehicle(id: string, userId: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['brand', 'model', 'version', 'user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.user && vehicle.user.id !== userId) {
      throw new ForbiddenException(
        `Vehicle with ID ${id} does not belong to user with ID ${userId}`,
      );
    }

    // ✅ Guardar información del vehículo antes de eliminarlo (para el email)
    const vehicleInfo = {
      brand: vehicle.brand.name,
      model: vehicle.model.name,
      version: vehicle.version.name,
      year: vehicle.year,
    };

    const userInfo = {
      email: vehicle.user.email,
      name: vehicle.user.name,
    };

    // Eliminar el vehículo
    await this.vehicleRepository.delete(id);

    // ✅ Enviar notificación por email después de la eliminación exitosa
    try {
      await this.mailService.sendVehicleDeletedNotification(
        userInfo.email,
        userInfo.name,
        vehicleInfo,
      );
    } catch (emailError) {
      // Log del error pero no fallar la operación
      console.error('Error enviando notificación de vehículo eliminado:', emailError);
    }

    return {
      data: id,
      message: 'Vehicle deleted successfully',
    };
  }
}
