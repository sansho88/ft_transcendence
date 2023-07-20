import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	/**
	 * Todo: update with new thing in table
	 */
	async create(createUserDto: CreateUserDto) {
		if (createUserDto.username === undefined)
			createUserDto.username = createUserDto.login;
		const user = User.create({
			username: createUserDto.username,
			login: createUserDto.login,
		});
		user.friend_list = [];
		await user.save();
		return `User ${user.username} created with login ${user.login} successfully :D`;
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
		if (updateUser.username !== undefined) user.username = updateUser.username;
		if (updateUser.avatar_path !== undefined)
			user.avatar_path = updateUser.avatar_path;
		if (updateUser.token_2fa !== undefined)
			user.token_2fa = updateUser.token_2fa;
		if (updateUser.status !== undefined) user.status = updateUser.status;
		await user.save();
		return 'User updated :D';
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
