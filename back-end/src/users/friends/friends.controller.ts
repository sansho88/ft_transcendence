import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { UsersController } from '../users.controller';

@Controller('friends')
export class FriendsController extends UsersController {
	@Get(':login')
	findFriend(@Param('login') login: string) {
		return this.findOne(login).then((target) => {
			return target.friend_list;
		});
	}

	// @Post()
	// addFriend(@Body() request: { target1: string; target2: string }) {
	// 	const target1 = this.findOne(request.target1).then((target) => target);
	// }
}
