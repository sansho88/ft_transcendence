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

	async create(createUserDto: CreateUserDto) {
		const user = new User();
		user.id_users = createUserDto.id_users;
		user.username = createUserDto.username;
		console.log('HELP');
		return User.save(user);
		// return `This action adds a new user in ${createUserDto.username}`;
	}

	findAll() {
		return `This action returns all users`;
	}

	findOne(id: number) {
		// return this.usersRepository.findBy(id);
		return `This action returns a #${id} user`;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
