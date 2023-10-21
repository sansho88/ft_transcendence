import {
	BadRequestException, Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards, ValidationPipe,
} from '@nestjs/common';
import {ChannelService} from './channel.service';
import {AuthGuard} from '../module.auth/auth.guard';
import {CurrentUser} from '../module.auth/indentify.user';
import {UserEntity} from '../entities/user.entity';
import {UsersService} from '../module.users/users.service';
import {ChatGateway} from './chat.ws';
import {BannedService} from "./banned.service";
import {MutedService} from "./muted.service";
import {MessageService} from "./message.service";
import {ChannelEntity} from "../entities/channel.entity";
import {InviteService} from "./invite.service";
import {ChangeChannelDTOPipe} from "../dto.pipe/channel.dto";
import {ChannelCredentialService} from "./credential.service";
import {checkLimitID} from "../dto.pipe/checkIntData";

@Controller('channel')
export class ChannelController {
	constructor(
		private readonly channelService: ChannelService,
		private readonly messageService: MessageService,
		private readonly bannedService: BannedService,
		private readonly mutedService: MutedService,
		private readonly usersService: UsersService,
		private readonly chatGateway: ChatGateway,
		private readonly inviteService: InviteService,
		private readonly credentialService: ChannelCredentialService
	) {
	}

	@Post('create')
	@UseGuards(AuthGuard)
	async create() {
		return "Use WebSocket event 'createRoom'";
	}

	@Get('get')
	@UseGuards(AuthGuard)
	findAll() {
		return this.channelService.findAll().catch(() => []);
	}

	/**
	 * Used to get a specified channel (Need the 'user' To avoid conflict with other get)
	 * @param channelID
	 */
	@Get('get/infos/:channelID')
	@UseGuards(AuthGuard)
	findOne(@Param('channelID', ParseIntPipe) channelID: number) {
		checkLimitID(channelID);
		return this.channelService.findOne(channelID);
	}

	@Get('get/list/:channelID')
	@UseGuards(AuthGuard)
	getUserList(@Param('channelID', ParseIntPipe) channelID: number) {
		checkLimitID(channelID);
		return this.channelService.findOne(channelID, ['userList'], true).then(value => value.userList);
	}

	@Get('mychannel')
	@UseGuards(AuthGuard)
	findMy(@CurrentUser() user: UserEntity) {
		return this.channelService.findAll(['userList'])
			.then(lstchan => lstchan
				.filter(channel => channel.userList
					.find(usr => usr.UserID == user.UserID)))
	}

	/**
	 *
	 *  ## Path for admin in Channel
	 *  . Admin
	 *    - TODO: admin/:channelID
	 *  	- admin/add/:channelID/:targetID -------- PUT
	 *  	- admin/remove/:channelID/:targetID ----- PUT
	 *
	 *  . Ban
	 *  	- get/ban/:channelID -------------------- GET
	 *  	- ban/:channelID/:targetID/:banDuration - PUT
	 *  	- pardon/:banID ------------------------- PUT
	 *
	 *  . Mute
	 *   	- get/mute/:channelID ------------------- GET
	 *   	- mute/:channelID/:userID/:duration ----- PUT
	 *   	- unmute/:muteID ------------------------ PUT
	 *
	 *  . Kick
	 *   	- kick/:channelID/:userID --------------- PUT
	 *
	 *    -------
	 *
	 *  . Path For messages related
	 *    - msg/:channelID ------------------------ GET
	 *    - msg/after/:channelID/:timestamp ------- GET
	 *    - msg/before/:channelID/:timestamp ------ GET
	 *
	 *    -------
	 *
	 *  . Path For invite related Get and Put
	 *  	- myinvite ------------------------------ GET
	 *    - invite/:channelID --------------------- GET
	 *    - invite/add/:channelID/:userID --------- PUT
	 *    - invite/remove/:inviteID --------------- PUT
	 **/
	@Put('admin/add/:channelID/:targetID')
	@UseGuards(AuthGuard)
	async addAdmin(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('targetID', ParseIntPipe) targetID: number,
	) {
		checkLimitID(channelID);
		checkLimitID(targetID);
		const channel = await this.channelService.findOne(channelID, ['adminList', 'userList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		const target = await this.usersService.findOne(targetID);
		if (this.channelService.userIsAdmin(target, channel)) {
			throw new BadRequestException(
				'This user have already administrator power',
			);
		}
		return this.channelService.addAdmin(target, channel);
	}

	@Put('admin/remove/:channelID/:targetID')
	@UseGuards(AuthGuard)
	async removeAdmin(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('targetID', ParseIntPipe) targetID: number,
	) {
		checkLimitID(channelID);
		checkLimitID(targetID);
		const channel = await this.channelService.findOne(channelID, ['adminList', 'userList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		const target = await this.usersService.findOne(targetID);
		if (!(this.channelService.userIsAdmin(target, channel))) {
			throw new BadRequestException(
				"This user doesn't have administrator power",
			);
		}
		if (target.UserID == channel.owner.UserID)
			throw new BadRequestException('The target is the ChannelOwner and cannot lost his Administrator Power');
		return this.channelService.removeAdmin(target, channel);
	}


	@Get('get/ban/:channelID')
	@UseGuards(AuthGuard)
	async getBan(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
	) {
		checkLimitID(channelID);
		await this.bannedService.update();
		const channel = await this.channelService.findOne(channelID, ['adminList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		return this.bannedService.findAll(channel);
	}

	@Put('ban/:channelID/:targetID/:banDuration')
	@UseGuards(AuthGuard)
	async banUser(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('targetID', ParseIntPipe) targetID: number,
		@Param('banDuration', ParseIntPipe) duration: number, // Time of ban in sec()
	) {
		checkLimitID(channelID);
		checkLimitID(targetID);
		await this.bannedService.update();
		const channel = await this.channelService.findOne(channelID, ['adminList', 'userList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		const target = await this.usersService.findOne(targetID);
		await this.channelService.banUser(target, channel, duration);
		await this.chatGateway.ban(channel, target);
	}

	@Put('pardon/:banID')
	@UseGuards(AuthGuard)
	async pardonUser(
		@CurrentUser() user: UserEntity,
		@Param('banID', ParseIntPipe) banID: number
	) {
		checkLimitID(banID);
		await this.bannedService.update();
		const ban = await this.bannedService.findOne(banID);
		const channel = await this.channelService.findOne(ban.channel.channelID, ['adminList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		await this.bannedService.pardon(ban);
	}

	@Get('get/mute/:channelID')
	@UseGuards(AuthGuard)
	async getMute(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
	) {
		checkLimitID(channelID);
		await this.mutedService.update();
		const channel = await this.channelService.findOne(channelID, ['adminList', 'muteList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		return this.mutedService.findAll(channel);
	}

	@Put('mute/:channelID/:userID/:duration')
	@UseGuards(AuthGuard)
	async muteUser(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('userID', ParseIntPipe) targetID: number,
		@Param('duration', ParseIntPipe) duration: number,
	) {
		checkLimitID(channelID);
		checkLimitID(targetID);
		await this.mutedService.update();
		const channel = await this.channelService.findOne(channelID, ['adminList', 'muteList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		const target = await this.usersService.findOne(targetID);
		await this.channelService.muteUser(target, channel, duration);
		await this.chatGateway.mute(channel, target, duration)
	}

	@Put('unmute/:muteID')
	@UseGuards(AuthGuard)
	async unMuteUser(
		@CurrentUser() user: UserEntity,
		@Param('muteID', ParseIntPipe) muteID: number,
	) {
		checkLimitID(muteID);
		await this.mutedService.update();
		const mute = await this.mutedService.findOne(muteID);
		const channel = await this.channelService.findOne(mute.channel.channelID, ['adminList', 'muteList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		await this.mutedService.unmute(mute);
	}

	@Put('kick/:channelID/:userID')
	@UseGuards(AuthGuard)
	async kickUSer(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('userID', ParseIntPipe) targetID: number,
	) {
		console.log('kick : chan' + channelID + ' / target : ' + targetID);
		checkLimitID(channelID);
		checkLimitID(targetID);
		const channel = await this.channelService.findOne(channelID, ['adminList', 'userList'])
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException('You aren\'t administrator on this channel');
		}
		const target = await this.usersService.findOne(targetID);
		if (!(await this.channelService.userInChannel(target, channel)))
			throw new BadRequestException('This user isn\'t part of this channel')
		await this.chatGateway.kick(channel, target);
	}

	@Get('msg/before/:channelID/:timestamp')
	@UseGuards(AuthGuard)
	async beforeMsg(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('timestamp', ParseIntPipe) timestamp: number,
	) {
		checkLimitID(channelID);
		const minTime = new Date(timestamp);
		minTime.setUTCHours(minTime.getHours() + 2);
		const channel: ChannelEntity = await this.channelService.findOne(channelID, ['messages', 'userList'], true)
		if (!(await this.channelService.userInChannel(user, channel)))
			throw new BadRequestException('You aren\'t part of that channel')
		return this.messageService.filterBefore(channel.messages, minTime);
	}

	@Get('msg/after/:channelID/:timestamp')
	@UseGuards(AuthGuard)
	async afterMsg(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('timestamp', ParseIntPipe) timestamp: number,
	) {
		checkLimitID(channelID);
		const maxTime = new Date(timestamp);
		maxTime.setUTCHours(maxTime.getHours() + 2);
		const channel: ChannelEntity = await this.channelService.findOne(channelID, ['messages', 'userList'], true)
		if (!(await this.channelService.userInChannel(user, channel)))
			throw new BadRequestException('You aren\'t part of that channel')
		return this.messageService.filterAfter(channel.messages, maxTime);
	}

	@Get('msg/:channelID')
	@UseGuards(AuthGuard)
	async recentMsg(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
	) {
		if (channelID === -1)//gestion no channel pour simplifier et pas avoir derreur 401..
			return {data: []};
		checkLimitID(channelID);
		const channel: ChannelEntity = await this.channelService.findOne(channelID, ['messages', 'userList'], true)
		if (!(await this.channelService.userInChannel(user, channel)))
			throw new BadRequestException('You aren\'t part of that channel')
		return this.messageService.filterRecent(channel.messages);
	}

	@Get('myinvite')
	@UseGuards(AuthGuard)
	async myInvite(
		@CurrentUser() user: UserEntity,
	) {
		return this.usersService.findOne(user.UserID, ['invite']).then(usr => usr.invite)
	}

	@Get('invite/:channelID')
	@UseGuards(AuthGuard)
	async getInvite(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
	) {
		checkLimitID(channelID);
		const channel = await this.channelService.findOne(channelID, ['userList']);
		if (!await this.channelService.userInChannel(user, channel))
			throw new BadRequestException('You aren\'t part of that channel')
		return await this.inviteService.findAllChannel(channel);
	}

	@Put('invite/add/:channelID/:userID')
	@UseGuards(AuthGuard)
	async addInvite(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('userID', ParseIntPipe) targetID: number,
	) {
		checkLimitID(channelID);
		checkLimitID(targetID);
		const channel = await this.channelService.findOne(channelID, ['userList']);
		const target = await this.usersService.findOne(targetID);
		if (!await this.channelService.userInChannel(user, channel))
			throw new BadRequestException('You aren\'t part of that channel');
		if (await this.channelService.userInChannel(target, channel))
			throw new BadRequestException('This user is already on that channel');
		if (await this.channelService.userIsBan(channel, target))
			throw new BadRequestException('This user is Banned for this channel');
		if (await this.inviteService.userIsInvite(channel, target))
			throw new BadRequestException('This user has already an invite to this channel');
		const invite = await this.inviteService.create(target, channel, user);
		await this.chatGateway.receivedInvite(invite);
		return invite;
	}

	@Put('invite/remove/:inviteID')
	@UseGuards(AuthGuard)
	async removeInvite(
		@CurrentUser() user: UserEntity,
		@Param('inviteID', ParseIntPipe) inviteID: number,
	) {
		checkLimitID(inviteID);
		const invite = await this.inviteService.findOne(inviteID);
		if (invite == null)
			throw new BadRequestException('This invite is not created or already accepted');
		if (invite.sender.UserID != user.UserID)
			throw new BadRequestException('This invite is not created by you');
		await this.inviteService.remove(invite);
	}

	@Put('modif/:channelID')
	@UseGuards(AuthGuard)
	async modifyChannel(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Body(new ValidationPipe()) data: ChangeChannelDTOPipe,
	) {
		checkLimitID(channelID);
		const channel = await this.channelService.findOne(channelID);
		if (channel.owner.UserID !== user.UserID)
			throw new BadRequestException('You need to be the channel Owner to change it');
		const credential = await this.credentialService.create(data.password);
		return this.channelService.modifyChannel(channel, credential, data);
	}
}
