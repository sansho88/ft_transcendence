import {
	BadRequestException,
	Controller,
	Delete,
	Patch,
	Param,
	Body,
	Post,
	Get,
	Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':login')
	findOne(@Param('login') login: string) {
		return this.usersService.findOne(login).then((result) => {
			if (!result) {
				throw new BadRequestException('This Login is not registered');
			}
			return result;
		});
	}

	@Put()
	follow(@Body() follow_update: { target1: string; target2: string }) {
		// const followed
	}

	@Patch(':login')
	update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+login, updateUserDto);
	}

	@Delete(':login')
	remove(@Param('login') login: string) {
		return this.usersService.remove(+login);
	}
}
