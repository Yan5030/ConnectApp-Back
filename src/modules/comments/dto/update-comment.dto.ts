import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Optional new content for the comment',
    example: 'Este es el comentario actualizado.'
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Optional new media URL for the comment',
    example: 'https://example.com/new-image.jpg'
  })
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}