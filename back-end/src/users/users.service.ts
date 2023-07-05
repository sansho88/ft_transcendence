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
		const user = User.create({
			username: createUserDto.username,
		});
		await user.save();
		return `User ${user.username} created with id ${user.id_users} successfully :D`;
	}

	findAll() {
		return this.usersRepository.find();
	}

	/**
	 * Todo: return something (Error code?) if invalid id
	 */
	findOne(id: number) {
		return this.usersRepository.findOneBy({ id_users: id });
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
