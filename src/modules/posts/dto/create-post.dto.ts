import { IsUrl, ValidateIf, IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PrivacyEnum } from 'src/enum/privacy.enum';

export class CreatePostDto {
  
  @ApiProperty({
    description: 'ID del usuario al que pertenece el post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string; // El usuario al que pertenece el post
  
  @ApiProperty({
    description: 'Imagen asociada al post (si no se proporciona video o contenido)',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid image URL' })
  image?: string;

  @ApiProperty({
    description: 'Video asociado al post (si no se proporciona imagen o contenido)',
    example: 'https://example.com/video.mp4',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid video URL' })
  video?: string;

  @ApiProperty({
    description: 'Contenido textual del post (si no se proporciona imagen o video)',
    example: 'Este es un post de ejemplo',
    required: false,
  })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @IsOptional()
  content?: string;


  @ApiProperty({
    description: 'Privacidad del post. Si no se especifica, será público por defecto',
    enum: PrivacyEnum,
    default: PrivacyEnum.PUBLIC,
    required: false,
  })
  @IsEnum(PrivacyEnum, { message: 'Privacy must be either public or private' })
  privacy?: PrivacyEnum = PrivacyEnum.PUBLIC; // Si no se envía, será PUBLIC
}
