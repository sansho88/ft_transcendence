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
import { ChannelService } from './channel.service';
import { AuthGuard } from '../module.auth/auth.guard';
import {CurrentUser} from "../module.auth/indentify.user";
import {UserEntity} from "../entities/user.entity";
import {UsersService} from "../module.users/users.service";
import {ChatGateway} from "./chat.ws";

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService,
							private readonly usersService: UsersService,
							private readonly chatGateway: ChatGateway) {}

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

	@Get('get/:channelID')
	@UseGuards(AuthGuard)
	findOne(@Param('channelID', ParseIntPipe) channelID: number) {
		return this.channelService.findOne(channelID);
	}

	@Get('msg/:channelID/:timestamp')
	@UseGuards(AuthGuard)
	async getMessages(@Param('channelID', ParseIntPipe) channelID: number,
									@Param('timestamp', ParseIntPipe) timestamp: number,
	){
		const minTime = new Date(timestamp * 1000);
		minTime.setUTCHours(minTime.getHours() + 2)
		const channel = await this.channelService.findOne(channelID);
		if (channel == null) throw new BadRequestException('this channel doesn\'t exist');
		return this.channelService.getMessages(channel, minTime);
	}

	@Put('admin/add/:channelID/:targetID')
	@UseGuards(AuthGuard)
	async addAdmin(@CurrentUser() user: UserEntity,
								 @Param('channelID', ParseIntPipe) channelID: number,
								 @Param('targetID', ParseIntPipe) targetID: number,
	){
		if (!await this.channelService.userIsAdmin(user, channelID)) {
			throw new BadRequestException('You aren\'t administrator on this channel');
		}
		const target = await this.usersService.findOne(targetID);
		if (await this.channelService.userIsAdmin(target, channelID)) {
			throw new BadRequestException('This User have already administrator power');
		}
		const channel = await this.channelService.findOne(channelID);
		if (channel == null) throw new BadRequestException('this channel doesn\'t exist');
		if (target == null) throw new BadRequestException('this user doesn\'t exist');
		return this.channelService.addAdmin(target, channel);
	}
}
