import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';
import { User } from '../users/entities/user.entity';
import { FriendshipStatus } from '../../enum/friendShipStatus.enum'
import { FriendResponseDto } from './dto/friendResponse.dto';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Obtener amigos de un usuario: solo amigos con estado 'ACCEPTED'
  async getFriends(userId: string): Promise<FriendResponseDto[]> {
    
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
      }
  
    if (!user.friends || user.friends.length === 0) {
      throw new NotFoundException('This user has no friends');
      }
    return user.friends.map(friend => new FriendResponseDto(friend.id, friend.name, friend.profilePicture));
    }
  
    async getFriendRequests(userId: string): Promise<Friendship[]> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['receivedFriendRequests'], 
      });
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      return user.receivedFriendRequests.filter(request => request.status === FriendshipStatus.PENDING) || []; 
    }

  // async getFriendRequests(userId: string): Promise<Friendship[]> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['sentFriendRequests', 'receivedFriendRequests'],
  //   });
  
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  
  //   // Unir las solicitudes enviadas y recibidas
  //   const requests = [
  //     ...user.sentFriendRequests,
  //     ...user.receivedFriendRequests,
  //   ];
  
  //   return requests; // Devuelve las solicitudes de amistad
  // }
  

  // Enviar solicitud de amistad
  async sendFriendRequest(fromUserId: string, toUserId: string) {
    
    const existingRequest = await this.friendshipRepository.findOne({
      where: [
        { requester: { id: fromUserId }, receiver: { id: toUserId }, status: FriendshipStatus.PENDING },
        { requester: { id: toUserId }, receiver: { id: fromUserId }, status: FriendshipStatus.PENDING },
      ],
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists or is already pending.');
    }
    const requester = await this.userRepository.findOne({ where: { id: fromUserId } });
    const receiver = await this.userRepository.findOne({ where: { id: toUserId } });

    if (!requester || !receiver) {
      throw new BadRequestException('One or both users not found.');
    }

    const friendship = this.friendshipRepository.create({
      requester,    
      receiver,     
      status: FriendshipStatus.PENDING,    
    });

    const savedFriendship = await this.friendshipRepository.save(friendship);
    return {
      success: true,
      message: 'Friend request sent successfully',
      friendshipId: savedFriendship.id,
    };
  }

  async updateFriendRequestStatus(
    userId: string, 
    friendshipId: string, 
    status: FriendshipStatus
  ): Promise<{ message: string }> {
    const request = await this.friendshipRepository.findOne({
      where: { id: friendshipId },
      relations: ['requester', 'receiver'],  
    });
  
    if (!request) {
      throw new NotFoundException('Friend request not found');
    }
  
    if (![FriendshipStatus.ACCEPTED, FriendshipStatus.DENIED].includes(status)) {
      throw new BadRequestException({ message: 'Status must be either "accepted" or "denied".' });
    }
  
    console.log('User ID:', userId);  
    console.log('Receiver ID:', request.receiver.id); 
  
    if (request.receiver.id !== userId) {
      throw new ForbiddenException('You are not authorized to update this friend request.');
    }
  
    request.status = status;
    await this.friendshipRepository.save(request);
  
    let responseMessage = `Friend request ${status.toLowerCase()} successfully.`;
  
    if (status === FriendshipStatus.ACCEPTED) {
      const requester = request.requester;
      const receiver = request.receiver;
  
      requester.friends = requester.friends || [];
      receiver.friends = receiver.friends || [];
  
      requester.friends.push(receiver);
      receiver.friends.push(requester);
  
      await this.userRepository.save(requester);
      await this.userRepository.save(receiver);
  
      responseMessage = 'Friend request accepted successfully.';
    }
  
    return { message: responseMessage };
  }
  
  
  // async updateFriendRequestStatus(userId: string, requestId: string, status: FriendshipStatus): Promise<{message:string}> {
  //   // Buscar la solicitud de amistad por ID
  //   const request = await this.friendshipRepository.findOne({
  //     where: { id: requestId },
  //     relations: ['requester', 'receiver'],  // Asegúrate de cargar las relaciones con los usuarios
  //   });

  //   if (!request) {
  //     throw new NotFoundException('Friend request not found');
  //   }

  //   if (![FriendshipStatus.ACCEPTED, FriendshipStatus.DENIED].includes(status)) {
  //     throw new BadRequestException({ message: 'Status must be either "accepted" or "denied".' });
  //   }

  //   // Actualizar el estado de la solicitud
  //   request.status = status;
  //   await this.friendshipRepository.save(request);

  //   let responseMessage = `Friend request ${status.toLowerCase()} successfully.`;

  //   // Si el estado es 'ACCEPTED', agregar a ambos usuarios a la lista de amigos
  //   if (status === FriendshipStatus.ACCEPTED) {
  //     const requester = request.requester;
  //     const receiver = request.receiver;

  //     // Si no existe la relación de amigos en la propiedad 'friends', agregarla
  //     if (!requester.friends) {
  //       requester.friends = [];
  //     }
  //     if (!receiver.friends) {
  //       receiver.friends = [];
  //     }

  //     // Añadir ambos usuarios a las listas de amigos
  //     requester.friends.push(receiver);
  //     receiver.friends.push(requester);

  //     // Guardar los usuarios con su nueva relación de amistad
  //     await this.userRepository.save(requester);
  //     await this.userRepository.save(receiver);

  //     responseMessage = 'Friend request accepted successfully.';
  //   }
  //   return { message: responseMessage };
  // }
}
