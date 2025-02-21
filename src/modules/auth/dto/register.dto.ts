import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
}
