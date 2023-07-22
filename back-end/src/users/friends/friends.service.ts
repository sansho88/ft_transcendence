import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class FriendsService extends UsersService {
	async addFriend(target_login1: string, target_login2: string) {
		// return 'wip';
		const target1 = await this.findOne(target_login1);
		const target2 = await this.findOne(target_login2);
		console.log('post friend test');
		if (
			target1.friend_list !== undefined &&
			target1.friend_list.find((i) => i.login === target2.login)
		)
			return 'Already added';
		if (target1.friend_list === undefined) target1.friend_list = [];
		target1.friend_list.push(target2); // todo: crash there i don t know why
		await this.usersRepository.save(target1);
		return 'Friend added';
	}

	async getFriend(target: string) {
		return await this.usersRepository.find({
			relations: {
				friend_list: true,
			},
			where: {
				login: target,
			},
		});
	}
}
