import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserWithFriendsDto } from './dto/userWithFriends.dto';
import { Friendship } from '../friendship/entities/friendship.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>
  ) {}

  // Buscar usuario por ID
  async findUserById(id: string): Promise<UserWithFriendsDto> {
    const user = await this.usersRepository.findOne({ where: { id }, 
      relations: ['sentFriendRequests', 'receivedFriendRequests']
     });

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      friends: user.friendsCount, 
      birthday: user.birthday,
      status: user.status,
    };
  }
  // Obtener todos los usuarios
  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // Actualizar perfil del usuario
  async updateUser(id: string, updateUserDto: any) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
  
    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);

    return {
      success: true,
      message: 'Profile updated successfully',
      user,
    };
  }
}
