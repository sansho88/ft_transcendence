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
		if (typeof createUserDto.user_name == undefined)
			createUserDto.user_name = createUserDto.user_login;
		const user = User.create({
			username: createUserDto.user_name,
			login: createUserDto.user_login,
		});
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

	/**
	 * Todo: do those
	 */
	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
