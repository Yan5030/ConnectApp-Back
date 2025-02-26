import { Controller, Get, Post, Param, Body, NotFoundException, Put } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendFriendRequestDto } from './dto/sendFriendRequest.dto';
import { UpdateFriendRequestDto } from './dto/updateFriendRequest.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('Friendships')  // Categoriza este controlador dentro de "Friendships" en Swagger
@Controller('friends')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  // Obtener amigos de un usuario
  @Get(':userId/friends')
@ApiOperation({ summary: 'Get all friends of a user' })
@ApiResponse({ status: 200, description: 'Friends list retrieved successfully.' })
@ApiResponse({ status: 404, description: 'User not found.' })
async getFriends(@Param('userId') userId: string) {
  return this.friendshipService.getFriends(userId);
}


  @Get('requests/:userId')
  @ApiOperation({ summary: 'Get all friendship requests of a user' })
  @ApiResponse({ status: 200, description: 'List of friendship requests returned successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getFriendRequests(@Param('userId') userId: string) {
    return this.friendshipService.getFriendRequests(userId);
  }


  // Enviar solicitud de amistad
  @Post('request')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiBody({  type: SendFriendRequestDto })
  @ApiResponse({ status: 200, description: 'Friend request sent successfully.' })
  @ApiResponse({ status: 400, description: 'Request already sent or invalid data.' })
  async sendFriendRequest(
    @Body() body: SendFriendRequestDto,) {
      const result = await this.friendshipService.sendFriendRequest(body.fromUserId, body.toUserId);
      return {
        success: result.success,
        message: result.message,
        friendshipId: result.friendshipId,  // Retornamos el id de la solicitud
      };
  }

  // Cambiar el estado de la solicitud de amistad (aceptar o rechazar)
  @Put('request/friendshipId')
  @ApiOperation({ summary: 'Accept or deny a friend request' })
  @ApiResponse({ status: 200, description: 'Friend request updated successfully.' })
  @ApiResponse({ status: 404, description: 'Friend request not found.' })
  @ApiResponse({ status: 400, description: 'Invalid status value.' })
  async updateFriendRequestStatus(
    @Param('friendshipId') friendshipId: string, 
    @Body() body: UpdateFriendRequestDto  
  ) {
    return this.friendshipService.updateFriendRequestStatus(friendshipId, body.status);
  }
}
