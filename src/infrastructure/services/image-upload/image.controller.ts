import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { writeFile } from 'fs';
import * as sharp from 'sharp';
import { Public } from 'src/infrastructure/auth-module/decorators/auth.decorator';
import { Throttle } from '@nestjs/throttler';
import { MAX_IMAGE_SIZE, PUBLIC_IMAGE_DIR_PATH } from 'src/infrastructure/common/constants';
import { generateRandomString } from 'src/infrastructure/utils/common-functions.util';

@Controller('/files')
@ApiTags('Files')
@Public()
export class FilesController {
  @Post('/image-single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('form-data/multipart')
  @Throttle({ default: { ttl: 10_1000, limit: 7 } })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE })],
      }),
    )
    file: Express.Multer.File,
  ) {
    //generate a radom le name for the uploaded file
    let fileName = generateRandomString().toString();

    //extract the extension of the file.
    const { originalname } = file;

    const extensionIndex = originalname.indexOf('.');
    let extension = originalname.substring(extensionIndex, originalname.length);

    let isNotImage = false;
    if (!this.isImage(extension)) {
      isNotImage = true;
    } else {
      extension = '.webp';
    }

    const urlFix = fileName + extension;

    fileName = `${PUBLIC_IMAGE_DIR_PATH}/${urlFix}`;

    if (isNotImage) {
      await writeFile(fileName, file.buffer, () => {});
    } else {
      await sharp(file.buffer).resize(600).webp({ effort: 2 }).toFile(fileName);
    }

    const url = `${urlFix}`;
    return { url };
  }

  @Post('/images-multi')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE }),
          //new FileTypeValidator({ fileType: ALLOWED_FILE_TYPES }),
        ],
      }),
    )
    files,
  ) {
    let urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      //generate a random file name for the uploaded file
      let fileName = generateRandomString().toString();

      //extract the extension of the file
      const { originalname } = file;

      const extensionIndex = originalname.indexOf('.');
      let extension = originalname.substring(
        extensionIndex,
        originalname.length,
      );

      let isNotImage = false;
      if (!this.isImage(extension)) {
        isNotImage = true;
      } else {
        extension = '.webp';
      }

      const urlFix = fileName + extension;

      fileName = `${PUBLIC_IMAGE_DIR_PATH}/${urlFix}`;
      if (isNotImage) {
        await writeFile(fileName, file.buffer, () => {});
      } else {
        await sharp(file.buffer)
          .resize(600)
          .webp({ effort: 3 })
          .toFile(fileName);
      }

      const url = `${urlFix}`;
      urls.push(url);
    }

    return { urls };
  }

  private isImage(extension: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.includes(extension.toLowerCase());
  }
}
