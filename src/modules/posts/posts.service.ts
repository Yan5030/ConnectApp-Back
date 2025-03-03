import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ResponsePostDto } from './dto/response-post.dto';
import { PrivacyEnum } from 'src/enum/privacy.enum';
import { runInThisContext } from 'vm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}
  
  async createPost(createPostDto: CreatePostDto): Promise<ResponsePostDto> {
    const { content, image, video, privacy, userId} = createPostDto;
   
    if (!content && !image && !video) {
      throw new BadRequestException('At least one field (content, image, or video) must be provided.');
    }
 
    const user = await this.usersRepository.findOne({where : {id: userId}});
    if (!user) { 
      throw new NotFoundException(`User with ID ${userId} not found`)
 
    }


    const newPost = this.postsRepository.create({
      content,
      image,
      video,
      privacy,
      user,
    });
   
    try {
      const savedPost = await this.postsRepository.save(newPost);
  
      // Devolver el DTO de respuesta sin necesidad de forzar la conversión
      return {
        id: savedPost.id,
        content: savedPost.content ?? undefined,
        image: savedPost.image ?? undefined,
        video: savedPost.video ?? undefined,
        privacy: savedPost.privacy as PrivacyEnum,
        createdAt: savedPost.createdAt, 
        user:  savedPost.user.id ,
      };
    }   catch (error) {
        throw new InternalServerErrorException('Error saving post in the database');
      } 
  }

  async findAllUsersPosts(userId:string): Promise<ResponsePostDto[]> {
    const user = await this.usersRepository.findOne({
      where: {id: userId},
      relations: ['posts', 'posts.user']
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.posts.length === 0){
      throw new NotFoundException ('this user has no posts')
    }
    
    return user.posts.map(post => ({
      id: post.id,
      content: post.content ?? undefined,
      image: post.image ?? undefined,
      video: post.video ?? undefined,
      privacy: post.privacy as PrivacyEnum,
      createdAt: post.createdAt,
      user: post.user.id
    }));
  }

  async findOne(id: string): Promise<ResponsePostDto>
  {
    
    const post = await this.postsRepository.findOne({
      where: {id},
      relations: ['user'],
    });


     if (!post) {
      throw new NotFoundException('Post not found');
     }

     if (!post.user) {
      throw new InternalServerErrorException('User is null in the post relation');
    }

     return {
      id: post.id,
      content: post.content ?? undefined,
      image: post.image ?? undefined,
      video: post.video ?? undefined,
      privacy: post.privacy as PrivacyEnum,
      createdAt: post.createdAt,
      user: post.user.id
     }
    
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
