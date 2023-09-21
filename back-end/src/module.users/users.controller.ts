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
import {UserEntity} from "../entities/user.entity";

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ***/

	@Get('me')
	@UseGuards(AuthGuard)
	me(@CurrentUser() user: UserEntity) {
		return user;
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
		@CurrentUser() user: UserEntity,
		@Body() update: UpdateUserDto,
	) {
		return this.usersService.update(user, update);
	}
}
