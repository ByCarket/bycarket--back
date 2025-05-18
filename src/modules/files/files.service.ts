import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseIdDto } from 'src/dto/postsDto/responses-post.dto';
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

  async updateImgUser(id: string, file: Express.Multer.File): Promise<ResponseIdDto> {
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

 async uploadVehicleImages(userId: string, files: Express.Multer.File[], vehicleId: string): Promise<ResponseIdDto> {
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

  const currentPhotos = vehicle.photos ?? [];

  if (currentPhotos.length + files.length > 6) {
    throw new HttpException(
      {
        status: 400,
        error: 'A vehicle cannot have more than 6 images.',
      },
      400,
    );
  }

  const uploadResults = await Promise.all(
    files.map((file) => this.uploadImgCloudinary(file)),
  );

  const urls = uploadResults.map((res) => res.secure_url);
  vehicle.photos = [...currentPhotos, ...urls];

  await this.vehicleRepository.save(vehicle);

  return {
    data: vehicleId,
    message: 'Vehicle images uploaded successfully.',
  };
}

}
