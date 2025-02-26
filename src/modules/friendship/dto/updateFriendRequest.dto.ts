import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FriendshipStatus } from '../../../enum/friendShipStatus.enum';

export class UpdateFriendRequestDto {
  @ApiProperty({
    example: 'accepted',
    enum: FriendshipStatus,
    description: 'The new status of the friend request',
  })
  @IsEnum(FriendshipStatus, { message: 'Status must be either "accepted" or "denied".' })
  status: FriendshipStatus;
}
