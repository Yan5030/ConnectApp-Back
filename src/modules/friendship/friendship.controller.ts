import { Controller, Get, Post, Param, Body, NotFoundException, Put } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendFriendRequestDto } from './dto/sendFriendRequest.dto';

@ApiTags('Friendships')  // Categoriza este controlador dentro de "Friendships" en Swagger
@Controller('friends')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  // Obtener amigos de un usuario
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all friends of a user' })  // Descripción del endpoint
  @ApiResponse({ status: 200, description: 'List of friends returned successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getFriends(@Param('userId') userId: string) {
    return this.friendshipService.getFriends(userId);
  }

  // Enviar solicitud de amistad
  @Post('request')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiBody({  type: SendFriendRequestDto })
  @ApiResponse({ status: 200, description: 'Friend request sent successfully.' })
  @ApiResponse({ status: 400, description: 'Request already sent or invalid data.' })
  async sendFriendRequest(
    @Body() body: SendFriendRequestDto,) {
    return this.friendshipService.sendFriendRequest(body.fromUserId, body.toUserId);
  }

  // Cambiar el estado de la solicitud de amistad (aceptar o rechazar)
  @Put('request/:requesterId/:receiverId')
  @ApiOperation({ summary: 'Accept or deny a friend request' })
  @ApiResponse({ status: 200, description: 'Friend request updated successfully.' })
  @ApiResponse({ status: 404, description: 'Friend request not found.' })
  @ApiResponse({ status: 400, description: 'Invalid status value.' })
  async updateFriendRequestStatus(
    @Param('requesterId') requesterId: string,
    @Param('receiverId') receiverId: string,
    @Body() body: { status: 'accepted' | 'denied' }  // El cuerpo debe contener el nuevo estado
  ) {
    const { status } = body;
    return this.friendshipService.updateFriendRequestStatus(requesterId, receiverId, status);
  }
}
