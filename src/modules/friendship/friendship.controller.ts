// import { Controller, Get, Post, Param, Body, NotFoundException, Put } from '@nestjs/common';
// import { FriendshipService } from './friendship.service';
// import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
// import { SendFriendRequestDto } from './dto/sendFriendRequest.dto';
// import { UpdateFriendRequestDto } from './dto/updateFriendRequest.dto';
// import { User } from '../users/entities/user.entity';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard'
// import { UseGuards } from '@nestjs/common';


// @ApiTags('Friendships')  // Categoriza este controlador dentro de "Friendships" en Swagger
// @Controller('friends')
// export class FriendshipController {
//   constructor(private readonly friendshipService: FriendshipService) {}

//   // Obtener amigos de un usuario
//   @Get(':userId/friends')
// @ApiOperation({ summary: 'Get all friends of a user' })
// @ApiResponse({ status: 200, description: 'Friends list retrieved successfully.' })
// @ApiResponse({ status: 404, description: 'User not found.' })
// async getFriends(@Param('userId') userId: string) {
//   return this.friendshipService.getFriends(userId);
// }


//   @Get('requests/:userId')
//   @ApiOperation({ summary: 'Get all friendship requests of a user' })
//   @ApiResponse({ status: 200, description: 'List of friendship requests returned successfully.' })
//   @ApiResponse({ status: 404, description: 'User not found.' })
//   async getFriendRequests(@Param('userId') userId: string) {
//     return this.friendshipService.getFriendRequests(userId);
//   }


//   // Enviar solicitud de amistad
//   @Post('request')
//   @ApiOperation({ summary: 'Send a friend request' })
//   @ApiBody({  type: SendFriendRequestDto })
//   @ApiResponse({ status: 200, description: 'Friend request sent successfully.' })
//   @ApiResponse({ status: 400, description: 'Request already sent or invalid data.' })
//   async sendFriendRequest(
//     @Body() body: SendFriendRequestDto,) {
//       const result = await this.friendshipService.sendFriendRequest(body.fromUserId, body.toUserId);
//       return {
//         success: result.success,
//         message: result.message,
//         friendshipId: result.friendshipId,  // Retornamos el id de la solicitud
//       };
//   }

//   // Cambiar el estado de la solicitud de amistad (aceptar o rechazar)
//   @Put('request/friendshipId')
//   @ApiOperation({ summary: 'Accept or deny a friend request' })
//   @ApiResponse({ status: 200, description: 'Friend request updated successfully.' })
//   @ApiResponse({ status: 404, description: 'Friend request not found.' })
//   @ApiResponse({ status: 400, description: 'Invalid status value.' })
//   async updateFriendRequestStatus(
//     @Param('friendshipId') friendshipId: string, 
//     @Body() body: UpdateFriendRequestDto  
//   ) {
//     return this.friendshipService.updateFriendRequestStatus(friendshipId, body.status);
//   }
// }

import { Controller, Get, Post, Param, Body, Put, UseGuards, Request, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { SendFriendRequestDto } from './dto/sendFriendRequest.dto';
import { UpdateFriendRequestDto } from './dto/updateFriendRequest.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard'
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Friendships')  
@Controller('friendships')
@ApiBearerAuth()
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get('friends')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all friends of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Friends list retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'No friends found for the authenticated user.' })
  async getMyFriends(@Req() req: AuthRequest) {
    return this.friendshipService.getFriends(req.user.id);  // Usamos el userId del token
  }
  
  @Get('requests')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Get all friendship requests of the authenticated user' })
@ApiResponse({ status: 200, description: 'Friendship requests retrieved successfully.' })
@ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
@ApiResponse({ status: 404, description: 'No friendship requests found for the user.' })
async getMyFriendRequests(@Req() req: AuthRequest) {
  return this.friendshipService.getFriendRequests(req.user.id); 
}

@Post('request')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Send a friend request' })
@ApiBody({ type: SendFriendRequestDto })
@ApiResponse({ status: 201, description: 'Friend request sent successfully.' })
@ApiResponse({ status: 400, description: 'Bad request. Friend request already exists or is invalid.' })
@ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
@ApiResponse({ status: 404, description: 'User not found.' })
async sendFriendRequest(@Req() req: AuthRequest, @Body() body: SendFriendRequestDto) {
  const result = await this.friendshipService.sendFriendRequest(req.user.id, body.toUserId);  
  
  return {
    success: result.success,
    message: result.message,
    friendshipId: result.friendshipId, 
  };
}


@Put('request/:friendshipId')
@UseGuards(JwtAuthGuard)  
@ApiOperation({ summary: 'Accept or deny a friend request' })
@ApiResponse({ status: 200, description: 'Friend request updated successfully.' })
@ApiResponse({ status: 404, description: 'Friend request not found.' })
@ApiResponse({ status: 400, description: 'Invalid status value.' })
async updateFriendRequestStatus(
  @Param('friendshipId') friendshipId: string,
  @Body() body: UpdateFriendRequestDto,
  @Req() req: AuthRequest
) {
  console.log('Usuario en req:', req.user);
  console.log('Body recibido:', body);
  return this.friendshipService.updateFriendRequestStatus(
    req.user.id,
    friendshipId,
    body.status
  );
}
  
  // **Estos quedaran para un posible admin en todo caso
  // Obtener amigos de un usuario
  @Get(':userId/friends')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all friends of a user' })
  @ApiResponse({ status: 200, description: 'Friends list retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getFriends(@Param('userId') userId: string) {
    return this.friendshipService.getFriends(userId);
  }

  @Get('requests/:userId')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Get all friendship requests of a user' })
  @ApiResponse({ status: 200, description: 'List of friendship requests returned successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getFriendRequests(@Param('userId') userId: string) {
    return this.friendshipService.getFriendRequests(userId);
  }

  // Enviar solicitud de amistad
  // @Post('request')
  // @UseGuards(JwtAuthGuard)  // Aplica el guard para protección
  // @ApiOperation({ summary: 'Send a friend request' })
  // @ApiBody({ type: SendFriendRequestDto })
  // @ApiResponse({ status: 200, description: 'Friend request sent successfully.' })
  // @ApiResponse({ status: 400, description: 'Request already sent or invalid data.' })
  // async sendFriendRequest(
  //   @Body() body: SendFriendRequestDto,
  //   @Request() req: any  // Accede a la solicitud y al usuario autenticado
  // ) {
  //   const fromUserId = req.user.userId;  // Extrae el ID del usuario desde el token
  //   const { toUserId } = body;  // Obtén el destino de la solicitud
  //   const result = await this.friendshipService.sendFriendRequest(fromUserId, toUserId);
  //   return {
  //     success: result.success,
  //     message: result.message,
  //     friendshipId: result.friendshipId,  // Retornamos el id de la solicitud
  //   };
  // }

  //Cambiar el estado de la solicitud de amistad (aceptar o rechazar)
  // @Put('request/:friendshipId')
  // @UseGuards(JwtAuthGuard)  // Aplica el guard para protección
  // @ApiOperation({ summary: 'Accept or deny a friend request' })
  // @ApiResponse({ status: 200, description: 'Friend request updated successfully.' })
  // @ApiResponse({ status: 404, description: 'Friend request not found.' })
  // @ApiResponse({ status: 400, description: 'Invalid status value.' })
  // async updateFriendRequestStatus(
  //   @Param('friendshipId') friendshipId: string,
  //   @Body() body: UpdateFriendRequestDto,
  //   @Request() req: any  // Accede a la solicitud y al usuario autenticado
  // ) {
  //   return this.friendshipService.updateFriendRequestStatus(friendshipId, body.status);
  // }

 
}
