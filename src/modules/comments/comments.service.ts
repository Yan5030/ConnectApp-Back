import { ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from './entities/comment.entity';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { ResponseCommentsListDto } from './dto/response-commentList.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { CommentDto } from './dto/comment.dto';

@Injectable()


export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

 
  async create(postId: string, userId: string, createCommentDto: CreateCommentDto) {
   
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postsRepository.findOne({ where: { id: postId } });
    console.log("Post encontrado: ", post);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      post: post,
      user: user
    });

    await this.commentsRepository.save(comment);

    const response: ResponseCommentDto = {
      success: true,
      message: 'Comment added successfully',
      comment: {
        id: comment.id,
        content: comment.content,
        ...(comment.mediaUrl && { mediaUrl: comment.mediaUrl }), 
        createdAt: comment.createdAt.toISOString(),
        postId: comment.post.id,
        userId: comment.user.id,
      },
    };
      return response;
  }

  async findAll(userId: string): Promise<ResponseCommentsListDto> {
    const allMyComments = await this.commentsRepository.find({
      where: { user: { id: userId } }, 
    relations: ["user"],
    });
  
    return {
      success: true,
      message: 'Comentarios obtenidos correctamente',
      comments:
       allMyComments.map(comment => ({
        id: comment.id,
        content: comment.content,
        ...(comment.mediaUrl && { mediaUrl: comment.mediaUrl }),
        createdAt: comment.createdAt.toISOString(),
        postId: comment.post.id,
        userId: comment.user.id,
      })),
    };
  }

  async findCommentsByPostId(postId: string): Promise<ResponseCommentsListDto> {
    const comments = await this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['user', 'post'],
    });
  
    if (comments.length === 0) {
      throw new NotFoundException('No comments found for this post');
    }
  
    return {
      success: true,
      message: 'Comments retrieved successfully',
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        mediaUrl: comment.mediaUrl ?? '',
        createdAt: comment.createdAt.toISOString(),
        postId: comment.post.id,
        userId: comment.user.id,
      })),
    };
  }

  async update (
    id:string, 
    userId: string, 
    updateCommentDto: UpdateCommentDto
  ): Promise <ResponseCommentDto>
   {
    const comment = await this.commentsRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'post'] 
    });

    if (!comment)
      throw new NotFoundException('Comment not found');

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to update this comment');
    }

    if (updateCommentDto.content) {
      comment.content = updateCommentDto.content;
    }
    if (updateCommentDto.mediaUrl) {
      comment.mediaUrl = updateCommentDto.mediaUrl;
    }

    const updatedComment = await this.commentsRepository.save(comment);
    const response: ResponseCommentDto = {
      success: true,
      message: 'Comment updated successfully',
      comment: {
        id: updatedComment.id,
        content: updatedComment.content,
        ...(updatedComment.mediaUrl && { mediaUrl: updatedComment.mediaUrl }),
        createdAt: updatedComment.createdAt.toISOString(),
        postId: updatedComment.post.id,
        userId: updatedComment.user.id,
      },
    };
  
    return response;
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'post'], 
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }
    
    await this.commentsRepository.remove(comment);

    return {
      message: 'Comment deleted successfully',
    };
  }

}
