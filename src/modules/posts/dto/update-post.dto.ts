import { IsUrl, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  
  @ApiProperty({
    description: 'Nuevo contenido del post',
    example: 'Este es un post actualizado',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  content?: string;

  @ApiProperty({
    description: 'Nueva imagen asociada al post',
    example: 'https://example.com/updated-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid image URL' })
  image?: string;

  @ApiProperty({
    description: 'Nuevo video asociado al post',
    example: 'https://example.com/updated-video.mp4',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid video URL' })
  video?: string;
}
