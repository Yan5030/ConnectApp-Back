import { Controller, HttpCode, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiTags } from '@nestjs/swagger';
import { ImagesUploadPipe } from 'src/pipes/images-upload.pipe';

@ApiTags("Files")
@Controller('files')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post("uploadImage/:userId")
@UseInterceptors(FileInterceptor("file"))
@HttpCode(200)
async uploadImage(
  @Param("userId") userId: string,  // ← Aquí lo capturas
  @UploadedFile(new ImagesUploadPipe()) file: Express.Multer.File,
  @Query("type") type: string, // Tipo de imagen (profile, cover, post, etc.)
  @Query("postId") postId?: string,  // ← Opcional, si la imagen es de un post
  
) {
  const folderMap = {
    profile: "profile_pictures",
    cover: "cover_pictures",
    post: "post_images",
  };

  const folder = folderMap[type] || "others"; 

  const img = await this.fileUploadService.uploadFile({
    buffer: file.buffer,
    fieldName: file.fieldname,
    mimeType: file.mimetype,
    originalName: `${folder}/${userId}-${file.originalname}`, // Ahora usa `userId`
    size: file.size,
  });

  return { img, userId, postId };
}

}