import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { FriendshipStatus } from 'src/enum/friendShipStatus.enum';

export class SendFriendRequestDto {
  @ApiProperty({
    description: 'ID of the user who is sending the request',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  fromUserId: string;

  @ApiProperty({
    description: 'ID of the user who is receiving the request',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  toUserId: string;

  @ApiProperty({
    description: 'The initial status of the friend request.',
    example: 'pending',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus = FriendshipStatus.PENDING;
}
