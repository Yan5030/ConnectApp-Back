import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
 
  @ApiProperty ({
    description: 'nombre completo del usuario',
    example: 'Juan Perez',
  })
  @IsNotEmpty()
  name: string;


  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@dominio.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '123456',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Fecha de cumpleaños del usuario',
    example: '1990-05-10',
    required: false,
  })
  @IsOptional()
  @IsDateString() // Para validar que sea una fecha válida en formato ISO
  birthday?: string;
}
