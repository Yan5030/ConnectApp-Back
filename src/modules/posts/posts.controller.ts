import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

@Post() 
@ApiOperation({summary: "Publish a post"})
@ApiResponse({status: 201, description: 'Post created successfully'})
@ApiResponse({ status: 400, description: 'Invalid request data' })
@ApiResponse({ status: 500, description: 'Internal server error' })
@ApiBody ({type: CreatePostDto})
async create(@Body() createPostDto: CreatePostDto) {
 try {
  const createdPost = await this.postsService.createPost(createPostDto);
  return {
    sucess:true,
    message: 'Post created successfully',
    post: createdPost
}
 } catch (error) {
    if (error instanceof BadRequestException || error instanceof NotFoundException){
      throw error;
    }
    throw new InternalServerErrorException('Unexpected error occurred');
 } 
} 

  @Get('user/:userId')
  @ApiOperation({summary: "Retrieve posts from a specific user"})
  @ApiResponse({status: 200, description: 'Posts successfully retrieved'})
  @ApiResponse({ status: 404, description: 'user not found || this user has no posts' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async  findAll(@Param('userId')userId: string ) {
    return this.postsService.findAllUsersPosts(userId);
  }

  @Get(':id')
  @ApiOperation({summary: "Retrieve a specific post"})
  @ApiResponse({status: 200, description: 'Post successfully retrieved'})
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}


// @Get() // Método GET para obtener todos los recursos
// findAll() {
//   return this.nombreDelService.findAll();
// }

// @Get(':id') // Método GET para obtener un recurso por ID
// findOne(@Param('id') id: string) {
//   return this.nombreDelService.findOne(id);
// }

// @Put(':id') // Método PUT para actualizar un recurso
// update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
//   return this.nombreDelService.update(id, updateDto);
// }

// @Delete(':id') // Método DELETE para eliminar un recurso
// remove(@Param('id') id: string) {
//   return this.nombreDelService.remove(id);
// }
// }
