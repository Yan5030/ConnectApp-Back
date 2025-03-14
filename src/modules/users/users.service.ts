import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserWithFriendsDto } from './dto/userWithFriends.dto';
import { Friendship } from '../friendship/entities/friendship.entity';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';

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
  //actualizar perfil del usuario autenticado
  async updateMyProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Si la contraseña está presente, la hashificamos
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    const allowedFields = ['name', 'bio', 'profilePicture', 'coverPicture', 'location', 'status', 'birthday', 'password'];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updateUserDto).filter(([key]) => allowedFields.includes(key))
    );

    const invalidFields = Object.keys(updateUserDto).filter(key => !allowedFields.includes(key));
    
    if (invalidFields.length > 0) {
      throw new BadRequestException(`Invalid fields: ${invalidFields.join(', ')}`);
    }
    Object.keys(filteredUpdates).forEach((key) => {
      user[key] = filteredUpdates[key];
    });

    await this.usersRepository.save(user);

    return {
      success: true,
      message: 'Profile updated successfully',
      user,
    };
  }


  // Actualizar perfil del usuario
  async updateUser(id: string, updateUserDto: any) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    const allowedFields = ['name', 'bio', 'profilePicture', 'coverPicture', 'location', 'status', 'birthday', 'password'];
  const filteredUpdates = Object.fromEntries(
    Object.entries(updateUserDto).filter(([key]) => allowedFields.includes(key))
  );
  const invalidFields = Object.keys(updateUserDto).filter(key => !allowedFields.includes(key));
  
  if (invalidFields.length > 0) {
    throw new BadRequestException(`Invalid fields: ${invalidFields.join(', ')}`);
  }
  Object.keys(updateUserDto).forEach((key) => {
    if (allowedFields.includes(key)) {
      user[key] = updateUserDto[key];
    }
  });
  
    Object.assign(user, filteredUpdates);
    await this.usersRepository.save(user);

    return {
      success: true,
      message: 'Profile updated successfully',
      user,
    };
  }
}
