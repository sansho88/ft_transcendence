import {
	Controller,
	Delete,
	Param,
	Body,
	Post,
	Get,
	Put,
	UseGuards,
	ParseIntPipe,
	BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { CurrentUser } from '../module.auth/indentify.user';
import { AuthGuard } from '../module.auth/auth.guard';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create() {
		return 'USE `/auth/sign` to create a new user';
	}
	@Delete(':id')
	remove(@Param('id') id: number) {
		return 'WIP';
	}

	/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ***/

	@Get('me')
	@UseGuards(AuthGuard)
	me(@CurrentUser('id', ParseIntPipe) id: number) {
		return this.usersService.findOne(id);
	}

	@Get('/get')
	@UseGuards(AuthGuard)
	findAll() {
		return this.usersService.findAll();
	}

	@Get('/get/:id')
	@UseGuards(AuthGuard)
	async findOneID(@Param('id', ParseIntPipe) id: number) {
		const user = await this.usersService.findOne(id);
		if (user == null) throw new BadRequestException();
		return user;
	}

	/*************************************************/

	@Put('update')
	@UseGuards(AuthGuard)
	updateNickname(
		@CurrentUser('id', ParseIntPipe) id: number,
		@Body() update: UpdateUserDto,
	) {
		return this.usersService.update(id, update);
	}
}
