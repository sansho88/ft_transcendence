import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { AuthGuard } from '../module.auth/auth.guard';

@Controller('ChannelControler')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Post('create')
	@UseGuards(AuthGuard)
	create() {
		return 'wip';
	}
	@Get()
	@UseGuards(AuthGuard)
	findAll() {
		return this.channelService.findAll();
	}
}
