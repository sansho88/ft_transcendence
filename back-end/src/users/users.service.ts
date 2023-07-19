import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IUser } from './type/user.type';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async count(): Promise<number> {
		return this.userRepository.count();
	}

	async hashPassAndCreateUser(user: User): Promise<User> {
		const hashedToken = await bcrypt.hash(user.token_2FA, 10);
		console.log('mdp hash =' + hashedToken);
		return {
			...user,
			token_2FA: hashedToken,
		};
	}

	async create(user: IUser): Promise<User | undefined> {
		// console.log(user.login +  '\navatar path: ' + user.avatar_path + '\npassword: ' + user.token_2FA);
		const existingUser = await this.findByUsername(user.login);
		if (existingUser) {
			throw new HttpException('login is already taken', HttpStatus.CONFLICT);
		}
		const newUser = this.userRepository.create(user);
		// console.log('newUserPass = ' + newUser.token_2FA);
		const tmpUser = await this.hashPassAndCreateUser(newUser);
		return await this.userRepository.save(tmpUser);
	}

	async findAll(): Promise<User[]> {
		return await this.userRepository.find();
	}

	async findByUsername(login: string): Promise<User | undefined> {
		return await this.userRepository.findOne({ where: { login } });
	}

	async findOne(id: number): Promise<User | undefined> {
		return await this.userRepository.findOne({ where: { Id_USERS: id } });
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		await this.userRepository.update(id, updateUserDto);
		return await this.userRepository.findOne({ where: { Id_USERS: id } });
	}

	async remove(id: number): Promise<void> {
		await this.userRepository.delete(id);
	}

	async removeAll(): Promise<void> {
		await this.userRepository.clear();
	}

	async comparePassword(
		toCompare: LoginUserDto,
	): Promise<{ success: boolean; message: string }> {
		const user = await this.findByUsername(toCompare.login);
		if (!user) throw new HttpException('Not found user', HttpStatus.NOT_FOUND);

		const passwordMatch = await bcrypt.compare(
			toCompare.password,
			user.token_2FA,
		);
		console.log(
			'password match = ' +
				passwordMatch +
				' \n ' +
				user.token_2FA +
				' vs ' +
				toCompare.password,
		);
		if (passwordMatch) {
			return { success: true, message: 'Logged in successfully' };
		} else {
			return { success: false, message: 'Invalid password' };
		}
	}
}
