import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { FriendshipStatus } from 'src/enum/friendShipStatus.enum';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
requester: User;

@ManyToOne(() => User, (user) => user.receivedFriendRequests)
receiver: User;

@Column({ type: 'enum', enum: FriendshipStatus, default: FriendshipStatus.PENDING })
  status: FriendshipStatus;
}
