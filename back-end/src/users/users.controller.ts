import {
	Controller,
	Delete,
	Put,
	Param,
	Body,
	Post,
	Get,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { IUser } from './type/user.type';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: IUser): Promise<User | undefined> {
		return this.userService.create(createUserDto);
	}

	@Post('login')
	comparePassword(
		@Body() loginUserDto: LoginUserDto,
	): Promise<{ success: boolean; message: string }> {
		return this.userService.comparePassword(loginUserDto);
	}

	@Get()
	async findAll() {
		return this.userService.findAll();
	}

	@Get('id/:id')
	async findOneById(@Param('id') id: string): Promise<User | undefined> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Get(':username')
	async findOneByUsername(
		@Param('username') username: string,
	): Promise<User | undefined> {
		const user = await this.userService.findByUsername(username);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User | { message: string }> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const updatedUser = await this.userService.update(
			parseInt(id),
			updateUserDto,
		);
		return updatedUser || { message: 'User updated successfully' };
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<{ message: string }> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		const tmp = user.username;
		await this.userService.remove(parseInt(id));
		return { message: `User ${tmp} (id: ${id}) removed successfully` };
	}

	@Delete()
	async removeAll(): Promise<{ message: string }> {
		await this.userService.removeAll();
		return { message: `All users removed successfully` };
	}
}
