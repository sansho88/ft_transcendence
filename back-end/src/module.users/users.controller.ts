import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	UseGuards,
	ParseIntPipe,
	BadRequestException,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from '../dto/user/update-user.dto';
import {AuthGuard} from '../module.auth/auth.guard';
import {UserEntity} from "../entities/user.entity";
import {CurrentUser} from '../module.auth/indentify.user';
import {InviteService} from "../module.channels/invite.service";
import {ChatGateway} from "../module.channels/chat.ws";
import {FollowEventDTO, UnFollowEventDTO} from "../dto/event.dto";

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly inviteService: InviteService,
		private readonly chatWsService: ChatGateway,
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

	@Put('follow/:userID')
	@UseGuards(AuthGuard)
	async follow(
		@CurrentUser() user: UserEntity,
		@Param('userID') targetID: number,
	) {
		if (targetID == user.UserID)
			throw new BadRequestException('You cannot follow Yourself');
		const target: UserEntity = await this.usersService.findOne(targetID);
		user = await this.usersService.findOne(user.UserID, ['subscribed'])
		if (user.subscribed.findIndex(usr => usr.UserID === target.UserID) + 1)
			throw new BadRequestException('You already following that user');
		user.subscribed.push(target);
		await user.save();
		user.subscribed = undefined;
		const event: FollowEventDTO = {user, type: FollowEventDTO.name};
		await this.chatWsService.sendEvent(target, event);
	}

	@Put('unfollow/:userID')
	@UseGuards(AuthGuard)
	async unfollow(
		@CurrentUser() user: UserEntity,
		@Param('userID') targetID: number,
	) {
		const target: UserEntity = await this.usersService.findOne(targetID);
		user = await this.usersService.findOne(user.UserID, ['subscribed'])
		let index = user.subscribed.findIndex(usr => usr.UserID === target.UserID) + 1;
		if (!index)
			throw new BadRequestException('You aren\'t following that user');
		user.subscribed = user.subscribed.filter(usr => usr.UserID !== target.UserID);
		await user.save();
		user.subscribed = undefined;
		const event: FollowEventDTO = {user, type: UnFollowEventDTO.name};
		await this.chatWsService.sendEvent(target, event);
	}

	@Get('mysubs')
	@Get('mysubs')
	@UseGuards(AuthGuard)
	async getSubscription(
		@CurrentUser() user: UserEntity
	) {
		return this.usersService.findOne(user.UserID, ['subscribed']).then(user => user.subscribed);
	}

	@Get('myfollow')
	@UseGuards(AuthGuard)
	async getFollowers(
		@CurrentUser() user: UserEntity
	) {
		return this.usersService.findOne(user.UserID, ['followers']).then(user => user.followers);
	}
}
