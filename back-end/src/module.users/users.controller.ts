import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	UseGuards,
	ParseIntPipe,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from '../dto/user/update-user.dto';
import {AuthGuard} from '../module.auth/auth.guard';
import {UserEntity} from "../entities/user.entity";
import {CurrentUser} from '../module.auth/indentify.user';
import {InviteService} from "../module.channels/invite.service";

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly inviteService: InviteService,
	) {
	}

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

	@Get('invite/received')
	@UseGuards(AuthGuard)
	getInviteReceived(
		@CurrentUser() user: UserEntity,
	) {
		return this.inviteService.findAllReceivedUser(user);
	}

	@Get('invite/send')
	@UseGuards(AuthGuard)
	getInviteSend(
		@CurrentUser() user: UserEntity,
	) {
		return this.inviteService.findAllSendUser(user);
	}
}
