import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { from } from 'rxjs';
import { FriendsService } from './friends.service';

@Controller('users')
export class FriendsController {
	constructor(
		private readonly usersService: UsersService,
		private readonly friendsService: FriendsService,
	) {}
	@Get('friends/:login')
	findFriend(@Param('login') login: string) {
		console.log('get friend test');
		return this.usersService.findOne(login).then((target) => {
			console.log(target.friend_list);
			return target.friend_list;
		});
	}

	@Post('friends')
	async addFriend(@Body() request: { target1: string; target2: string }) {
		return this.friendsService.addFriend(request.target1, request.target2);
	}
}
