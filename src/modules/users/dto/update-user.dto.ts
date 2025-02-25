import { IsString, IsOptional, IsUrl, IsEmail, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Name of the user', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Email of the user', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Password of the user', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Profile picture URL of the user', required: false })
  @IsUrl()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({ description: 'Cover photo URL of the user', required: false })
  @IsUrl()
  @IsOptional()
  coverPicture?: string;

  @ApiProperty({ description: 'Bio of the user', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Location of the user', required: false, nullable: true })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Birthday of the user', required: false, nullable: true })
  @IsDate()
  @IsOptional()
  birthday?: Date;
}
