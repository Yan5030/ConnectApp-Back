import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserWithFriendsDto } from './dto/userWithFriends.dto';
import { Friendship } from '../friendship/entities/friendship.entity';

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

    const friendsCount = await this.friendshipRepository.count({
        where: [{ requester: { id } }, { receiver: { id } }]
    });

    return { 
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        profilePicture: user.profilePicture,
        coverPicture: user.coverPicture,
        friends: friendsCount
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
