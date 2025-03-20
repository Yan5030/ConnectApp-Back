import { IsString, IsOptional, IsUUID } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';
import { CommentDto } from './comment.dto';

export class ResponseCommentDto {
  @IsString()
  success: boolean;

  @IsString()
  message: string;

  comment: CommentDto
}
