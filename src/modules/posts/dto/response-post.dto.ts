import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { PrivacyEnum } from 'src/enum/privacy.enum';

export class ResponsePostDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Este es un post de ejemplo', required: false })
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  content?: string | null;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  image?: string | null;

  @ApiProperty({ example: 'https://example.com/video.mp4', required: false })
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  video?: string | null ;

  @ApiProperty({ enum: PrivacyEnum, example: PrivacyEnum.PUBLIC })
  privacy: PrivacyEnum;

  @ApiProperty({ example: '2024-02-28T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: { id: 'user-uuid-123' } })
  user: string ;
}
