import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from './entities/comment.entity';

@Injectable()


export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

 
  async create(postId: string, createCommentDto: CreateCommentDto) {
    const { userId, content } = createCommentDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const newComment = new Comment();
      newComment.content = content;
      newComment.user = user;
      newComment.post = post;


      await this.commentsRepository.save(newComment);
    // const newComment = this.commentsRepository.create({
    //   content,
    //   user,
    //   post,
    // })// as Comment;
    // console.log(newComment);

    // await this.commentsRepository.save(newComment);

    return {
      id: newComment.id,
      postId: post.id,
      userId: user.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
    };
  } 
  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
