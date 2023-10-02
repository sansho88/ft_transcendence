import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdateUserDto} from '../dto/user/update-user.dto';
import {UserEntity, UserStatus} from '../entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserCredentialEntity} from '../entities/credential.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
	) {
	}

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
		newCredential: UserCredentialEntity,
	) {
		const user = this.usersRepository.create({
			login: newLogin,
			nickname: newLogin,
			visit: newInvite,
		});
		user.credential = newCredential;
		await user.save();
		console.log(`New User \`${user.login}\` with ID ${user.UserID}`);
		return user;
	}

	async findAll() {
		return this.usersRepository.find();
	}

	/**
	 * @return UserEntity Or Undefined if user not in db
	 */
	async findOne(userID: number, relations?: string[]) {
		let user;
		if (!relations)
			user = await this.usersRepository.findOneBy({UserID: userID});
		else
			user = await this.usersRepository.findOne({
				where: {UserID: userID},
				relations,
			});
		if (user == null) throw new BadRequestException("this user doesn't exist");
		return user;
	}

	async update(user: UserEntity, updateUser: UpdateUserDto) {
		if (updateUser.nickname !== undefined) user.nickname = updateUser.nickname;
		if (updateUser.avatar !== undefined) user.avatar_path = updateUser.avatar;
		if (updateUser.has_2fa !== undefined) user.has_2fa = updateUser.has_2fa;
		if (updateUser.status !== undefined) user.status = updateUser.status;
		await user.save();
		return user;
	}

	async getCredential(userID: number) {
		const target = await this.usersRepository.findOne({
			where: {UserID: userID},
			relations: ['credential'],
		});
		return target.credential;
	}

	async userStatus(user: UserEntity, newStatus: UserStatus) {
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
