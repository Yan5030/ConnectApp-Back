import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { ResponseCommentsListDto } from './dto/response-commentList.dto';

@Controller('comments')
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "Publish a comment"})
  @ApiResponse({status: 201, description: 'Comment created successfully'})
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody ({type: CreateCommentDto})
  async createComment (
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthRequest) {
    return this.commentsService.create(postId, req.user.id, createCommentDto);
  }

@Get()
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Get all comments from the authenticated user' })
@ApiResponse({status: 200,description: 'Comments retrieved successfully', type: ResponseCommentsListDto,})
@ApiResponse({status: 401, description: 'Unauthorized. User needs to be authenticated',})
@ApiResponse({status: 500, description: 'Internal server error',})
async getMyComments(@Req() req: AuthRequest) {
  return this.commentsService.findAll(req.user.id);
}

@Get(':postId/comments')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Get all comments for a specific post' })
@ApiResponse({
  status: 200,
  description: 'Comments retrieved successfully',
  type: ResponseCommentsListDto,
})
@ApiResponse({
  status: 404,
  description: 'No comments found for this post',
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
})
async getCommentsByPostId(
  @Param('postId') postId: string,
): Promise<ResponseCommentsListDto> {
  return this.commentsService.findCommentsByPostId(postId);
}

  @Put(':id') 
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', description: 'ID of the comment to update' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: AuthRequest
  ) {
    return this.commentsService.update(id, req.user.id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'ID of the comment to delete' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteComment(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return this.commentsService.delete(id, req.user.id);
  }
}

  

