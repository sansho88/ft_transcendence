import {
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
}
