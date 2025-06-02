import {
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ResponseIdDto } from 'src/DTOs/usersDto/responses-user.dto';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiUserProfileDocs } from './decorators/apiUploadUserProfileDocs.decorator';
import { ApiUploadVehicleImagesDocs } from './decorators/apiUploadVehicleImagesDocs.decorator';
import { ApiDeleteVehicleImageDocs } from './decorators/apiDeleteVehicleImageDocs.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiUserProfileDocs()
  @UseInterceptors(FileInterceptor('image'))
  @Patch('user-profile')
  @HttpCode(200)
  async uploadUserProfile(
    @UserAuthenticated('sub') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000,
            message: 'The file must not exceed 5Mb.',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseIdDto> {
    return this.filesService.updateImgUser(id, file);
  }

  @Patch('vehicle-images/:vehicleId')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiUploadVehicleImagesDocs()
  @HttpCode(200)
  @ApiBearerAuth()
  async updateVehicleImages(
    @UserAuthenticated('sub') userId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000,
            message: 'The file must not exceed 5Mb.',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.filesService.updateVehicleImages(userId, files, vehicleId);
  }

  @Delete(':vehicleId/images/:publicId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiDeleteVehicleImageDocs()
  async deleteVehicleImage(
    @UserAuthenticated('sub') userId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Param('publicId') publicId: string,
  ) {
    return this.filesService.deleteImgVehicle(vehicleId, userId, publicId);
  }
}
