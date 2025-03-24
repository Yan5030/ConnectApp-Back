import { IsBoolean, IsString } from 'class-validator';
import { CommentDto } from './comment.dto';

export class ResponseCommentsListDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  comments: Partial<CommentDto>[];
}
