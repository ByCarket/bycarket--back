import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseIdDto } from 'src/DTOs/usersDto/responses-user.dto';
import { Vehicle } from 'src/entities/vehicle.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async uploadImgCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else if (!result)
            throw new HttpException(
              { status: 500, error: 'Upload failed: No result returned from Cloudinary.' },
              500,
            );
          else resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  // Método para eliminar una imagen de Cloudinary
  async deleteCloudinaryImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error(`Error deleting image ${publicId} from Cloudinary:`, error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async deleteImgVehicle(vehicleId: string, userId: string, publicId: string) {
    // Buscar el vehículo con sus fotos
    const vehicle = await this.vehicleRepository.findOne({
      where: {
        id: vehicleId,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found for user.`);
    }

    // Verificar que el vehículo tenga fotos
    if (!vehicle.images || vehicle.images.length === 0) {
      throw new NotFoundException(`No photos found for vehicle with ID ${vehicleId}.`);
    }

    // Buscar la foto específica por public_id
    const photoToDelete = vehicle.images.find(photo => photo.public_id === publicId);

    if (!photoToDelete) {
      throw new NotFoundException(`Photo with publicId ${publicId} not found in vehicle.`);
    }

    try {
      // Eliminar la imagen de Cloudinary
      await this.deleteCloudinaryImage(publicId);

      // Remover la foto específica del array
      vehicle.images = vehicle.images.filter(photo => photo.public_id !== publicId);

      // Guardar el vehículo actualizado
      await this.vehicleRepository.save(vehicle);

      return {
        data: {
          vehicleId: vehicleId,
          deletedImageId: publicId,
          remainingPhotos: vehicle.images.length,
        },
        message: 'Vehicle photo deleted successfully.',
      };
    } catch (error) {
      console.error(`Error deleting photo ${publicId}:`, error);
      throw new BadRequestException(`Failed to delete photo: ${error.message}`);
    }
  }

  // Método para eliminar múltiples imágenes de Cloudinary
  async deleteMultipleCloudinaryImages(publicIds: string[]): Promise<void> {
    try {
      // Verificar que hay IDs para eliminar
      if (!publicIds || publicIds.length === 0) {
        return;
      }

      // Eliminar cada imagen una por una
      const deletePromises = publicIds.map(publicId => this.deleteCloudinaryImage(publicId));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error eliminating multiple images from Cloudinary:', error);
      throw new HttpException(
        { status: 500, error: 'Failed to delete images from Cloudinary.' },
        500,
      );
    }
  }

  async updateImgUser(id: string, file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    const uploadedImg = await this.uploadImgCloudinary(file);
    await this.usersRepository.update(id, { image: uploadedImg.secure_url });

    return {
      data: id,
      message: 'User image updated successfully.',
    };
  }

  async updateVehicleImages(
    userId: string,
    files: Express.Multer.File[],
    vehicleId: string,
  ) {
    const vehicle = await this.vehicleRepository.findOne({
      where: {
        id: vehicleId,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found for user.`);
    }

    const currentPhotos = vehicle.images ?? [];

    if (currentPhotos.length + files.length > 6) {
      throw new BadRequestException({
        error: 'A vehicle cannot have more than 6 images.',
      });
    }

    const uploadResults = await Promise.all(files.map(file => this.uploadImgCloudinary(file)));

    const newImages = uploadResults.map(res => ({
      public_id: res.public_id,
      secure_url: res.secure_url,
    }));
    vehicle.images = newImages;

    await this.vehicleRepository.save(vehicle);

    return {
      data: vehicle,
      message: 'Vehicle images uploaded successfully.',
    };
  }
}
