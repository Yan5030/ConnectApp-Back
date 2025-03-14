import { Controller, Get, Put, Param, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserWithFriendsDto } from './dto/userWithFriends.dto'
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('users') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Obtener un usuario por ID
  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully fetched.', type: UserWithFriendsDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  // Obtener todos los usuarios
  @Get()
  @ApiResponse({ status: 200, description: 'List of all users.', type: [UserWithFriendsDto] })
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }
//actualizar perfil del usuario autenticado
@Put('profile') 
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)  
@ApiBody({
    description: 'The user data to update',
    type: UpdateUserDto,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The user profile has been successfully updated.' 
  })
  @ApiResponse({ status: 400, description: 'Invalid fields in the request body.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateMyProfile(@Req() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;  
    return this.usersService.updateMyProfile(userId, updateUserDto);  
  }
  
  // Actualizar perfil de usuario, este podria ser para un admin
  @Put(':id')
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user profile has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            bio: { type: 'string' },
            profilePicture: { type: 'string' },
            coverPicture: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUserProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
