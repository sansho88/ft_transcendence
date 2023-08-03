import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserEntity, UserStatus } from '../entities/user.entity';
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

	async findAll() {
		return this.usersRepository.find();
	}

	/**
	 * Todo: return something (Error code?) if invalid id
	 */
	async findOne(login: string) {
		return this.usersRepository.findOneBy({ login: login });
	}

	async update(login: string, updateUser: UpdateUserDto) {
		const user = await this.usersRepository.findOneBy({ login: login });
		if (updateUser.nickname !== undefined) user.nickname = updateUser.nickname;
		if (updateUser.avatar !== undefined) user.avatar_path = updateUser.avatar;
		await user.save();
		return user;
	}

	// todo: remove user from db
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

	async userStatus(login: string, newStatus: UserStatus) {
		const user = await this.usersRepository.findOneBy({ login: login });
		user.status = newStatus;
		await user.save();
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
