import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'Este es un comentario de prueba.',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Optional media URL (image, video, gif, etc.)',
    example: 'https://example.com/image.jpg',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}
