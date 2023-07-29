import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CredentialEntity } from '../entities/credential.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
	) {}

	/**
	 * Todo: update with new thing in table
	 */
	/**
	 * Create and save the new user
	 * @param newLogin login of the user
	 * @param newInvite if true the person is treated not has a member of 42
	 * @param newCredential his credential
	 */
	async create(
		newLogin: string,
		newInvite: boolean,
		newCredential: CredentialEntity,
	) {
		const user = UserEntity.create({
			login: newLogin,
			nickname: newLogin,
			Invite: newInvite,
		});
		user.credential = newCredential;
		await user.save();
		return;
	}

	findAll() {
		return this.usersRepository.find();
	}

	/**
	 * Todo: return something (Error code?) if invalid id
	 */
	findOne(login: string) {
		return this.usersRepository.findOneBy({ login: login });
	}

	async update(login: string, updateUser: UpdateUserDto) {
		const user = await this.usersRepository.findOneBy({ login: login });
		if (updateUser.username !== undefined) user.nickname = updateUser.username;
		if (updateUser.avatar_path !== undefined)
			user.avatar_path = updateUser.avatar_path;
		if (updateUser.status !== undefined) user.status = updateUser.status;
		await user.save();
		return 'User updated :D';
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
	async getCredential(login: string) {
		const target = await this.usersRepository.findOne({
			relations: {
				credential: true,
			},
			where: {
				login: login,
			},
		});
		return target.credential;
	}

	// async getFriend(target: string) {
	// 	return await this.usersRepository.find({
	// 		relations: {
	// 			friend_list: true,
	// 		},
	// 		where: {
	// 			login: target,
	// 		},
	// 	});
	// }
}
