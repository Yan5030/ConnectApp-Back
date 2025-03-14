import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { FriendshipStatus } from 'src/enum/friendShipStatus.enum';

export class SendFriendRequestDto {
  @ApiProperty({
    description: 'ID of the user who is receiving the request',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  toUserId: string;  
}