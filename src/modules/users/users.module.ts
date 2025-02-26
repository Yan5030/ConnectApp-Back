import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Friendship } from '../friendship/entities/friendship.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([User, Friendship])],

  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
