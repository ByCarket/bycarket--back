import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseIdDto } from 'src/dto/responses-user.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async uploadImgRepository(file: Express.Multer.File): Promise<UploadApiResponse> {
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

    const uploadedImg = await this.uploadImgRepository(file);
    await this.usersRepository.update(id, { image: uploadedImg.secure_url });

    return {
      data: id,
      message: 'User image updated successfully.',
    };
  }
}
