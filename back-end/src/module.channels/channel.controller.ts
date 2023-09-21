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

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

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

	@Put('join/:channelID')
	@UseGuards(AuthGuard)
	async joinChannel() {
		return "Use WebSocket event 'joinRoom'";
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
}
