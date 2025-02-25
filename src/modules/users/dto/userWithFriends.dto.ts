import { ApiProperty } from '@nestjs/swagger';

export class UserWithFriendsDto {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'Full name of the user' })
  name: string;

  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @ApiProperty({ description: 'Short biography of the user' })
  bio: string;

  @ApiProperty({ description: 'Location of the user' })
  location: string;

  @ApiProperty({ description: 'Profile picture URL of the user' })
  profilePicture: string;

  @ApiProperty({ description: 'Cover picture URL of the user' })
  coverPicture: string;

  @ApiProperty({ description: 'Total number of friends the user has' })
  friends: number;
}
