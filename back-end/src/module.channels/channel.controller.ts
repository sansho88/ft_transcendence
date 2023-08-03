import {
	BadRequestException,
	Body,
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
import { CurrentUser } from '../module.auth/indentify.user';
import { CreateChannelDTO } from '../dto/channel/create-channel.dto';
import { ChannelCredentialService } from './credential.service';
import { UsersService } from '../module.users/users.service';

@Controller('channel')
export class ChannelController {
	constructor(
		private readonly channelService: ChannelService,
		private readonly userService: UsersService,
		private readonly credentialService: ChannelCredentialService,
	) {}

	@Post('create')
	@UseGuards(AuthGuard)
	async create(
		@Body() createChannel: CreateChannelDTO,
		@CurrentUser('id', ParseIntPipe) id: number,
	) {
		const user = await this.userService.findOne(id);
		const credential = await this.credentialService.create(
			createChannel.password,
		);
		return this.channelService.create(
			createChannel.name,
			credential,
			createChannel.protected,
			user,
		);
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

	@Put('join/:channelID')
	@UseGuards(AuthGuard)
	async joinChannel(
		@Param('channelID', ParseIntPipe) channelID: number,
		@CurrentUser('id', ParseIntPipe) userID: number,
	) {
		const chan = await this.channelService.findOne(channelID);
		const user = await this.userService.findOne(userID);
		console.log(chan);
		if (!(await this.channelService.userInChannel(user, chan)))
			return await this.channelService.joinChannel(user, chan);
		throw new BadRequestException('User already in channel');
	}
}
