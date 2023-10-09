import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	UseGuards,
	ParseIntPipe,
	Query,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from '../dto/user/update-user.dto';
import {AuthGuard} from '../module.auth/auth.guard';
import {UserEntity} from "../entities/user.entity";
import {CurrentUser} from '../module.auth/indentify.user';
import {InviteService} from "../module.channels/invite.service";
import { ChannelService } from 'src/module.channels/channel.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly inviteService: InviteService,
		private readonly channelService: ChannelService,
	) {
	}

	/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ***/

	@Get('me')
	@UseGuards(AuthGuard)
	me(@CurrentUser() user: UserEntity) {
		return user;
	}

	@Get('/get/nicknameUsed/:nick')
	// @UseGuards(AuthGuard)
	nickNameUsed(@Param('nick') nick: string) {
		console.log('nick?: ' + nick) 
		return this.usersService.nicknameUsed(nick);
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

	/**
	 * retourne la liste des channels join par le user
	 * @param user 
	 * @returns 
	 */
	@Get('channelJoined')
	@UseGuards(AuthGuard)
	async channelJoined(@CurrentUser() user: UserEntity) {
		return await this.channelService.getJoinedChannelList(user);
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
