import {
	BadRequestException,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import {ChannelService} from './channel.service';
import {AuthGuard} from '../module.auth/auth.guard';
import {CurrentUser} from '../module.auth/indentify.user';
import {UserEntity} from '../entities/user.entity';
import {UsersService} from '../module.users/users.service';
import {ChatGateway} from './chat.ws';
import {BannedService} from "./banned.service";

@Controller('channel')
export class ChannelController {
	constructor(
		private readonly channelService: ChannelService,
		private readonly bannedService: BannedService,
		private readonly usersService: UsersService,
		private readonly chatGateway: ChatGateway,
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
		return this.channelService.findAll();
	}

	@Get('get/users/:channelID')
	@UseGuards(AuthGuard)
	findOne(@Param('channelID', ParseIntPipe) channelID: number) {
		return this.channelService.findOne(channelID);
	}

	@Get('msg/:channelID/:timestamp')
	@UseGuards(AuthGuard)
	async getMessages(
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('timestamp', ParseIntPipe) timestamp: number,
	) {
		const minTime = new Date(timestamp * 1000);
		minTime.setUTCHours(minTime.getHours() + 2);
		const channel = await this.channelService.findOne(channelID);
		return this.channelService.getMessages(channel, minTime);
	}

	@Put('admin/add/:channelID/:targetID')
	@UseGuards(AuthGuard)
	async addAdmin(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
		@Param('targetID', ParseIntPipe) targetID: number,
	) {
		const channel = await this.channelService.findOne(channelID, ['adminList']);
		if (!(await this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		const target = await this.usersService.findOne(targetID);
		if (await this.channelService.userIsAdmin(target, channel)) {
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
		const channel = await this.channelService.findOne(channelID, ['adminList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		const target = await this.usersService.findOne(targetID);
		if (!(this.channelService.userIsAdmin(target, channel))) {
			throw new BadRequestException(
				"This user doesn't have administrator power",
			);
		}
		return this.channelService.removeAdmin(target, channel);
	}


	@Get('get/ban/:channelID')
	@UseGuards(AuthGuard)
	async getBan(
		@CurrentUser() user: UserEntity,
		@Param('channelID', ParseIntPipe) channelID: number,
	) {
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
		await this.bannedService.update();
		const channel = await this.channelService.findOne(channelID, ['adminList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		const target = await this.usersService.findOne(targetID);
		await this.channelService.banUser(target, channel, duration);
		if (await this.channelService.userInChannel(target, channel))
			await this.chatGateway.leaveChat(channel, target);
	}

	@Put('pardon/:banID')
	@UseGuards(AuthGuard)
	async pardonUser(
		@CurrentUser() user: UserEntity,
		@Param('banID', ParseIntPipe) banID: number
	) {
		await this.bannedService.update();
		const ban = await this.bannedService.findOne(banID);
		const channel = await this.channelService.findOne(ban.channel.channelID, ['adminList']);
		if (!(this.channelService.userIsAdmin(user, channel))) {
			throw new BadRequestException("You aren't administrator on this channel");
		}
		await this.bannedService.pardon(ban);
	}
}
