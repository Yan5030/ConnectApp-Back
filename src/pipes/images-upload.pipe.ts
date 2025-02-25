import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImagesUploadPipe implements PipeTransform {
  private readonly allowedMimeType =["image/png","image/jpeg","image/jpg","image/gif"]
  transform(file:Express.Multer.File) {
    if(!file){
      throw new BadRequestException("No file exists");
    }

    if(!this.allowedMimeType.includes(file.mimetype)){
      throw new BadRequestException("The file is not in an allowed format");
    }

    return file;
  }
}
