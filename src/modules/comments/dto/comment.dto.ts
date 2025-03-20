import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CommentDto {
  @IsUUID()
  id: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsString()
  createdAt: string;

  @IsUUID()
  postId: string;

  @IsUUID()
  userId: string;
}
