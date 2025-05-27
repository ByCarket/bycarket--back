import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleProfileDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email del usuario de Google',
    example: 'usuario@gmail.com'
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre del usuario de Google',
    example: 'Usuario Google'
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID único de Google (sub)',
    example: '123456789'
  })
  sub: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'URL de la imagen de perfil',
    example: 'https://lh3.googleusercontent.com/a/imagen.jpg'
  })
  image?: string;
}
