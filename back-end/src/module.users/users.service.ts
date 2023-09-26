import {Injectable} from '@nestjs/common';
import {UpdateUserDto} from '../dto/user/update-user.dto';
import {UserEntity, UserStatus} from '../entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOptionsRelations, Repository} from 'typeorm';
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
	async findOne(id: number | string) {
		if (typeof id === 'number')
			return this.usersRepository.findOneBy({UserID: id});
		return this.usersRepository.findOneBy({login: id});
	}

	async findOneRelation(
		id: number,
		relation: FindOptionsRelations<UserEntity>,
	) {
		return this.usersRepository.findOne({
			relations: relation,
			where: {UserID: id},
		});
	}

	async update(id: number, updateUser: UpdateUserDto) {
		const user = await this.usersRepository.findOneBy({UserID: id});
		if (updateUser.nickname !== undefined) user.nickname = updateUser.nickname;
		if (updateUser.avatar !== undefined) user.avatar_path = updateUser.avatar;
		if (updateUser.has_2fa !== undefined) user.has_2fa = updateUser.has_2fa;
		await user.save();
		return user;
	}

	// todo: remove user from db
	remove(id: number) {
		return `This action removes a #${id} user`;
	}

	async getCredential(login: string) {
		const target = await this.usersRepository.findOne({
			where: {login: login},
			relations: {credential: true},
		});
		return target.credential;
	}

	async userStatus(id: number, newStatus: UserStatus) {
		const user = await this.usersRepository.findOneBy({UserID: id});
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
