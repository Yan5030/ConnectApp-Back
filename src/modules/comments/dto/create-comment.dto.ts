import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Contenido del comentario', example: 'Este es un comentario de prueba' })
  @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
  content: string;

  @ApiProperty({ description: 'ID del usuario que realiza el comentario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID del post al que pertenece el comentario', example: '987e6543-a21b-45c7-89d3-123456789abc' })
  @IsNotEmpty()
  @IsUUID()
  postId: string;
}
