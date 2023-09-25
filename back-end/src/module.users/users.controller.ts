import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	UseGuards,
	ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { AuthGuard } from '../module.auth/auth.guard';
import { UserEntity } from "../entities/user.entity";
import { CurrentUser } from '../module.auth/indentify.user';

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
		return await this.usersService.findOne(id);
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
