import {
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ResponseIdDto } from 'src/dto/responses-user.dto';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch('user-profile')
  @HttpCode(200)
  async uploadUserProfile(
    @UserAuthenticated('sub') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'The file must not exceed 200kb.',
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
}
