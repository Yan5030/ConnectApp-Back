import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Reaction } from '../reactions/entities/reaction.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Reaction, Comment])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
