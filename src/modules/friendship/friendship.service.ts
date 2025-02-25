import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';
import { User } from '../users/entities/user.entity';
import { FriendshipStatus } from '../../enum/friendShipStatus.enum'

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Obtener amigos de un usuario: solo amigos con estado 'ACCEPTED'
  async getFriends(userId: string): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sentFriendRequests', 'receivedFriendRequests'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Filtrar amigos con estado 'ACCEPTED'
    const friends = [
      ...user.sentFriendRequests.filter((f) => f.status === FriendshipStatus.ACCEPTED).map((f) => f.receiver),
      ...user.receivedFriendRequests.filter((f) => f.status === FriendshipStatus.ACCEPTED).map((f) => f.requester),
    ];

    return friends;
  }

  // Enviar solicitud de amistad
  async sendFriendRequest(fromUserId: string, toUserId: string) {
    // Verificar si la solicitud ya existe
    const existingRequest = await this.friendshipRepository.findOne({
      where: [
        { requester: { id: fromUserId }, receiver: { id: toUserId }, status: FriendshipStatus.PENDING },
        { requester: { id: toUserId }, receiver: { id: fromUserId }, status: FriendshipStatus.PENDING },
      ],
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists or is already pending.');
    }

    // Obtener los usuarios de la base de datos
    const requester = await this.userRepository.findOne({ where: { id: fromUserId } });
    const receiver = await this.userRepository.findOne({ where: { id: toUserId } });

    if (!requester || !receiver) {
      throw new BadRequestException('One or both users not found.');
    }

    // Crear la solicitud de amistad
    const friendship = this.friendshipRepository.create({
      requester,    // Usamos las entidades completas
      receiver,     // Usamos las entidades completas
      status: FriendshipStatus.PENDING,       // El estado será "pending" por defecto
    });

    // Guardamos la solicitud de amistad
    await this.friendshipRepository.save(friendship);
    return {
      success: true,
      message: 'Friend request sent successfully',
    };
  }

  async updateFriendRequestStatus(
    requesterId: string,
    receiverId: string,
    status: 'accepted' | 'denied',
  ) {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { requester: { id: requesterId }, receiver: { id: receiverId } },
        { requester: { id: receiverId }, receiver: { id: requesterId } },
      ],
    });

    if (!friendship) {
      throw new NotFoundException('Friend request not found.');
    }

    // Actualizar el estado de la solicitud de amistad
    if (status === 'accepted') {
      friendship.status = FriendshipStatus.ACCEPTED;
    } else if (status === 'denied') {
      friendship.status = FriendshipStatus.DENIED;
    } else {
      throw new Error('Invalid status value.');
    }

    return await this.friendshipRepository.save(friendship);
  }
}
