import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserWithFriendsDto } from './dto/userWithFriends.dto';
import { Friendship } from '../friendship/entities/friendship.entity';
import { join } from 'path';
import * as fs from 'fs';

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
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    const defaultProfilePicture = '/assets/images/profile-default.jpg';
    const defaultCoverPicture = '/assets/images/cover-default.jpg';

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio || 'Hello, I am using this platform!',
      location: user.location || 'Fill your information',
      profilePicture: user.profilePicture || defaultProfilePicture,
      coverPicture: user.coverPicture || defaultCoverPicture,
      friends: 0, 
      birthday: user.birthday || 'Fill your information',
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

    Object.assign(user, updateUserDto); // Actualiza solo los campos enviados
    await this.usersRepository.save(user);

    return {
      success: true,
      message: 'Profile updated successfully',
      user,
    };
  }
}
