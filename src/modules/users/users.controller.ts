import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserWithFriendsDto } from './dto/userWithFriends.dto'
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users') // Etiqueta para agrupar los endpoints relacionados con usuarios
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

  // Actualizar perfil de usuario
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
