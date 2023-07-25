import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
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
		if (user.password) {
			const hashedPassword = await bcrypt.hash(user.password, 10);
			return {
				...user,
				password: hashedPassword,
			};
		} else {
			return user;
		}
	}

	async create(user: Partial<User>): Promise<User | undefined> {
		// console.log(user.login +  '\navatar path: ' + user.avatar_path + '\npassword: ' + user.token_2fa);
		const existingUser = await this.findByUsername(user.login);
		if (existingUser) {
			throw new HttpException('login is already taken', HttpStatus.CONFLICT);
		}
		const newUser = this.userRepository.create(user);
		if(!user.avatar_path)
			newUser.avatar_path = '';
		if (!user.nickname)
			newUser.nickname = user.login;
		if(!user.token_2fa)
			newUser.token_2fa = 'token2fa';
		newUser.status = 1;
		newUser.has_2fa = false;
		// console.log('newUserPass = ' + newUser.token_2fa);
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
		return await this.userRepository.findOne({ where: { id_user: id } });
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		await this.userRepository.update(id, updateUserDto);
		return await this.userRepository.findOne({ where: { id_user: id } });
	}

	async remove(id: number): Promise<void> {
		await this.userRepository.delete(id);
	}

	async removeAll(): Promise<void> {
		// await this.userRepository.clear();
		await this.userRepository.query('TRUNCATE TABLE "users" CASCADE'); // git push --force
	}

	async comparePassword(
		toCompare: LoginUserDto,
	): Promise<{ success: boolean; message: string }> {
		const user = await this.findByUsername(toCompare.login);
		if (!user) throw new HttpException('Not found user', HttpStatus.NOT_FOUND);

		const passwordMatch = await bcrypt.compare(
			toCompare.password,
			user.password,
		);
		console.log(
			'password match = ' +
				passwordMatch +
				' \n ' +
				user.password +
				' vs ' +
				toCompare.password,
		);
		if (passwordMatch) {
			return { success: true, message: 'Logged in successfully' };
		} else {
			throw new HttpException(
				{ success: false, message: 'Invalid password' },
				HttpStatus.UNAUTHORIZED,
			);
		}
	}
}
