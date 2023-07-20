import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './friends/friends.service';
@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController, FriendsController],
	providers: [UsersService, FriendsService],
})
export class UsersModule {}
