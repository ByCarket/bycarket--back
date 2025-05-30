import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

    const uploadedImages: CloudinaryVehicleImage[] = [];

    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      const brand = await this.brandRepository.findOneBy({ id: brandId });
      const model = await this.modelRepository.findOneBy({ id: modelId });
      const version = await this.versionRepository.findOneBy({ id: versionId });

      if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
      if (!brand) throw new NotFoundException(`Brand with ID ${brandId} not found`);
      if (!model) throw new NotFoundException(`Model with ID ${modelId} not found`);
      if (!version) throw new NotFoundException(`Version with ID ${versionId} not found`);

      // 1. Crear el vehículo (sin guardar en la base de datos todavía)
      const vehicle = this.vehicleRepository.create({
        brand,
        model,
        version,
        user,
        ...CreateVehicleDto,
      });

      // 2. Subir imágenes a Cloudinary si existen
      if (images && images.length > 0) {
        if (images.length > 6) {
          throw new HttpException(
            {
              status: 400,
              error: 'A vehicle cannot have more than 6 images.',
            },
            400,
          );
        }

        // Subir cada imagen a Cloudinary
        for (const image of images) {
          const uploadResult = await this.filesService.uploadImgCloudinary(image);

          // Guardar tanto el public_id como la secure_url
          uploadedImages.push({
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
          });
        }

        // Asignar las imágenes al vehículo
        vehicle.images = uploadedImages;
      }

      // 3. Guardar el vehículo en la base de datos
      const savedVehicle = await queryRunner.manager.save(vehicle);

      // 4. Commit de la transacción
      await queryRunner.commitTransaction();

      // ✅ 5. Enviar notificación por email (después del commit exitoso)
      try {
        await this.mailService.sendVehicleCreatedNotification(user.email, user.name, {
          brand: brand.name,
          model: model.name,
          version: version.name,
          year: savedVehicle.year,
        });
      } catch (emailError) {
        // Log del error pero no fallar la operación
        console.error('Error enviando notificación de vehículo creado:', emailError);
      }

      // 6. Retornar la respuesta
      savedVehicle.user = {
        id: savedVehicle.user.id,
        name: savedVehicle.user.name,
        email: savedVehicle.user.email,
      } as User;

      return {
        data: savedVehicle,
        message: 'Vehicle created successfully with images.',
      };
    } catch (error) {
      // Rollback de la transacción en caso de error
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      // Si se subieron imágenes a Cloudinary, eliminarlas
      if (uploadedImages.length > 0) {
        // Extraer solo los public_ids de las imágenes subidas
        const publicIds = uploadedImages.map(img => img.public_id);
        await this.filesService.deleteMultipleCloudinaryImages(publicIds);
      }

      throw error;
    } finally {
      // Liberar el query runner
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
      vehicleInfo
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
