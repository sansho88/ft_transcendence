import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../users.service';
import { FriendsService } from './friends.service';

@Controller('users')
export class FriendsController {
	constructor(
		private readonly usersService: UsersService,
		private readonly friendsService: FriendsService,
	) {}
	@Get('friends/:login')
	async getFriend(@Param('login') login: string) {
		return this.friendsService.getFriend(login);
	}

	@Post('friends')
	async addFriend(@Body() request: { target1: string; target2: string }) {
		return this.friendsService.addFriend(request.target1, request.target2);
	}
}
