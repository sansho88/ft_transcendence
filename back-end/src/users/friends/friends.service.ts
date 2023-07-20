import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';

@Injectable()
export class FriendsService extends UsersService {
	async addFriend(target_login1: string, target_login2: string) {
		return 'wip';
		const target1 = await this.findOne(target_login1);
		const target2 = await this.findOne(target_login2);
		console.log('post friend test');
		// if (target1 === undefined || target2 === undefined)  // already handel by findOne() (throw an error)
		// 	return 'User non-existent';
		if (
			target1.friend_list !== undefined &&
			target1.friend_list.find((i) => i.login === target2.login)
		)
			return 'Already added';
		if (target1.friend_list === undefined) target1.friend_list = [];
		target1.friend_list.push(target2); // todo: crash there i don t know why
		await target1.save();
		return 'Friend added';
	}
}
