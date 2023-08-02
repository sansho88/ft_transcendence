import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../entities/channel.entity';
import { UsersService } from '../module.users/users.service';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(ChannelEntity)
		private channelRepository: Repository<ChannelEntity>,
		private userService: UsersService,
	) {}
}
