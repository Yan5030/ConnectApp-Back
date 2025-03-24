import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CommentDto {
  @IsUUID()
  id: string;

  @IsString()
  @Transform(({ value }) => (value === null ? undefined : value))
  content: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === null ? undefined : value))
  mediaUrl?: string;

  @IsString()
  createdAt: string;

  @IsUUID()
  postId: string;

  @IsUUID()
  userId: string;
}
