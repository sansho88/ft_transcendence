import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { from } from 'rxjs';

@Controller('friends')
export class FriendsController extends UsersController {
	@Get(':login')
	findFriend(@Param('login') login: string) {
		console.log('get friend test');
		return this.findOne(login).then((target) => {
			console.log(target.friend_list);
			return target.friend_list;
		});
	}

	@Post()
	async addFriend(@Body() request: { target1: string; target2: string }) {
		return 'WIP';
		const target1 = await this.findOne(request.target1);
		const target2 = await this.findOne(request.target2);
		console.log('post friend test');
		// if (target1 === undefined || target2 === undefined)  // already handel by findOne() (throw an error)
		// 	return 'User non-existent';
		if (
			target1.friend_list !== undefined &&
			target1.friend_list.find((i) => i.login === target2.login)
		)
			return 'Already added';
		target1.friend_list.push(target2); // todo: crash there i don t know why
		await target1.save();
		return 'Friend added';
	}
}
