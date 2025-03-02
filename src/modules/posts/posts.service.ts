import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ResponsePostDto } from './dto/response-post.dto';
import { PrivacyEnum } from 'src/enum/privacy.enum';

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

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
